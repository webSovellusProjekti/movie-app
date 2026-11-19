// Vastaa ryhmien tietokantatoiminnoista
import { pool } from '../db.js';

// Luo ryhmän ja lisää luojan ryhmän ylläpitäjäksi samassa transaktiossa
export async function createGroup({ name, description, visibility, userId }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const groupResult = await client.query(
      `INSERT INTO groups (name, description, visibility, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, visibility, created_by, created_at`,
      [name, description, visibility, userId]
    );

    const group = groupResult.rows[0];
    // Ryhmän luojasta tehdään ryhmän ylläpitäjä
    await client.query(
      `INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'admin')`,
      [group.id, userId]
    );

    await client.query('COMMIT');

    return group;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Hakee ryhmät, jotka käyttäjä saa nähdä:
// Kaikki julkiset ryhmät ja ne yksityiset ryhmät, joiden jäsen käyttäjä on
export async function listGroupsForUser(userId) {
  const result = await pool.query(
    `SELECT g.id, g.name, g.description, g.visibility, g.created_at,
    (SELECT COUNT(*) FROM group_members gm
    WHERE gm.group_id = g.id)::int AS member_count,
    EXISTS (SELECT 1 FROM group_members gm
    WHERE gm.group_id = g.id AND gm.user_id = $1) AS is_member
    FROM groups g
    WHERE g.visibility = 'public'
    OR EXISTS (SELECT 1 FROM group_members gm
    WHERE gm.group_id = g.id AND gm.user_id = $1)
    ORDER BY g.created_at DESC`,
    [userId]
  );

  return result.rows;
}
