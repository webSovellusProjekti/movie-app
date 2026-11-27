// Vastaa arvostelujen tietokantatoiminnoista

import { pool } from '../db.js';

// Tallentaa uuden julkisen arvostelun
export async function createReview({ tmdbId, userId, body }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Haetaan elokuvan sisäinen ID TMDB-tunnisteen perusteella.
    // Jos elokuvaa ei vielä löydy movies-taulusta, luodaan sille rivi.
    const movieResult = await client.query(
      `INSERT INTO movies (tmdb_id)
       VALUES ($1)
       ON CONFLICT (tmdb_id)
       DO UPDATE SET tmdb_id = EXCLUDED.tmdb_id
       RETURNING id`,
      [tmdbId]
    );

    const movieId = movieResult.rows[0].id;

    // Tallennetaan arvostelu
    const reviewResult = await client.query(
      `INSERT INTO reviews (user_id, movie_id, rating, body, visibility)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, movie_id, body, visibility, created_at`,
      [userId, movieId, 1, body, 'public']
    );

    await client.query('COMMIT');

    return reviewResult.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;

  } finally {
    client.release();
  }
}