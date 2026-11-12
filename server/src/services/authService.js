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