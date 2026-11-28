// Vastaa ryhmien tietokantatoiminnoista
import { pool } from '../db.js';

// Luo ryhmän ja lisää luojan ryhmän ylläpitäjäksi samassa transaktiossa
export async function createGroup({ name, description, visibility, userId }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // Luodaan ryhmä
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



// Ryhmästä poistuminen
export async function leaveGroup({ groupId, userId }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Tarkistetaan käyttäjän rooli ryhmässä
    const memberResult = await client.query(
      `SELECT role
       FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    // Käyttäjä ei ole ryhmän jäsen
    if (memberResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { notMember: true };
    }

    // Jos käyttäjä on ylläpitäjä, poistetaan koko ryhmä
    if (memberResult.rows[0].role === 'admin') {
      await client.query(
        `DELETE FROM groups
         WHERE id = $1`,
        [groupId]
      );

      await client.query('COMMIT');
      return { deleted: true };
    }

    // Tavallinen jäsen poistuu ryhmästä
    await client.query(
      `DELETE FROM group_members
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    await client.query('COMMIT');
    return { deleted: false };

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

// Hakee yhden ryhmän tiedot käyttäjälle, tai null jos ryhmää ei role
// tai käyttäjä ei saa nähdä sitä (yksityinen ryhmä, jonka jäsen hän ei ole)
export async function getGroupForUser(groupId, userId) {
  const groupResult = await pool.query(
    `SELECT g.id,
            g.name,
            g.description,
            g.visibility,
            g.created_at,
            (SELECT COUNT(*) FROM group_members gm
              WHERE gm.group_id = g.id)::int AS member_count,
            (SELECT gm.role FROM group_members gm
              WHERE gm.group_id = g.id AND gm.user_id = $2) AS my_role
    FROM groups g
    WHERE g.id = $1
      AND (g.visibility = 'public'
            OR EXISTS (SELECT 1 FROM group_members gm
                        WHERE gm.group_id = g.id AND gm.user_id = $2))`,
    [groupId, userId]
  );

  const group = groupResult.rows[0];

  if (!group) {
    return null;
  }

  group.is_member = group.my_role !== null;
  delete group.my_role;

  // Jäsenlista vain jäsenille, sähköpostia ei palauteta
  if (group.is_member) {
    const membersResult = await pool.query(
      `SELECT u.id, u.username, gm.role, gm.joined_at
      FROM group_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.group_id = $1
      ORDER BY gm.joined_at`,
      [groupId]
    );

    group.members = membersResult.rows;
  }

  return group;
}
