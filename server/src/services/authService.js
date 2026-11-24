// Vastaa käyttäjän tietokantatoiminnoista ja salasanojen tarkistamisesta
// Pitää tietokantakyselyt erillään HTTP-pyynnöistä

import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const SALT_ROUNDS = 12;

export async function registerUser({ username, email, password }) {
  // Muutetaan salasana hash-muotoon
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Tallennetaan käyttäjä tietokantaan
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, role, created_at`,
    [username, email, passwordHash]
  );

  return result.rows[0];
}

// Tarkistaa kirjautumistiedot
export async function authenticateUser(username, password) {
  // Haetaan käyttäjä käyttäjänimen perusteella
  const result = await pool.query(
    `SELECT id, username, password_hash, role
     FROM users
     WHERE username = $1`,
    [username]
  );

  // Käyttäjää ei löytynyt
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  // Verrataan annettua salasanaa tallennettuun hashiin
  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  // Salasana ei täsmää
  if (!passwordMatches) {
    return null;
  }

  // Palautetaan käyttäjän julkiset tiedot
  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}

// Hakee yhden käyttäjän tiedot tietokannasta ID:n perusteella
export async function getUserById(userId) {
  const result = await pool.query(
    `SELECT id, username, email, role
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0] ?? null;
}


// Poistaa käyttäjätilin ja käsittelee käyttäjän ryhmäjäsenyydet
export async function deleteUserAccount(userId) {
  const client = await pool.connect();

  try {
    // Aloitetaan tietokantatransaktio
    await client.query('BEGIN');

    // Haetaan käyttäjän ryhmät ja lukitaan niiden tiedot
    const memberships = await client.query(
      `SELECT group_id, role
       FROM group_members
       WHERE user_id = $1
       ORDER BY group_id
       FOR UPDATE`,
      [userId]
    );

    // Käsitellään jokainen ryhmä erikseen
    for (const membership of memberships.rows) {
      const { group_id, role } = membership;

      // Haetaan muut ryhmän jäsenet aakkosjärjestyksessä
      const otherMembers = await client.query(
        `SELECT gm.user_id
         FROM group_members gm
         JOIN users u ON u.id = gm.user_id
         WHERE gm.group_id = $1
           AND gm.user_id != $2
         ORDER BY u.username ASC, gm.user_id ASC
         FOR UPDATE OF gm`,
        [group_id, userId]
      );

      // Jos ryhmässä ei ole muita jäseniä, poistetaan ryhmä
      if (otherMembers.rows.length === 0) {
        await client.query(
          'DELETE FROM groups WHERE id = $1',
          [group_id]
        );

        continue;
      }

      // Jos poistettava käyttäjä on admin,
      // siirretään admin-rooli seuraavalle jäsenelle
      if (role === 'admin') {
        const newAdmin = otherMembers.rows[0];

        await client.query(
          `UPDATE group_members
           SET role = 'admin'
           WHERE group_id = $1
             AND user_id = $2`,
          [group_id, newAdmin.user_id]
        );
      }

      // Poistetaan käyttäjän jäsenyys ryhmästä
      await client.query(
        `DELETE FROM group_members
         WHERE group_id = $1
           AND user_id = $2`,
        [group_id, userId]
      );
    }

    // Poistetaan käyttäjä
    const result = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    // Käyttäjää ei löytynyt
    if (result.rowCount === 0) {
      throw new Error('Käyttäjää ei löytynyt.');
    }

    // Vahvistetaan kaikki muutokset
    await client.query('COMMIT');

    return true;

  } catch (err) {
    // Virheen sattuessa perutaan kaikki muutokset
    await client.query('ROLLBACK');
    throw err;

  } finally {
    // Vapautetaan tietokantayhteys
    client.release();
  }
}
