// Rakentaa Express-sovelluksen ja määrittelee, mitä se osaa tehdä

import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { sessionMiddleware } from './config/session.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.set('trust proxy', 1);

app.use(sessionMiddleware);
app.use('/api/auth', authRoutes); // autentikointi routet
app.use('/api/movies', movieRoutes); // elokuvien routet
app.use('/api/groups', groupRoutes); // ryhmien routet
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (err) {
    console.error('Database health check failed:', err.message);

    res.status(503).json({
      status: 'error',
      database: 'unreachable'
    });
  }
});

// Tuntematon /api-osoite palauttaa JSON-virheen HTML-sivun sijaan
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Reittiä ei löytynyt.'
  });
});

// Keskitetty virheenkäsittely, tämän pitää olla viimeinen app.use
// Neljä parametria tarvitaan, jotta Express tunnistaa tämän virheenkäsittelijäksi
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Jos vastaus on jo lähtenyt, annetaan Expressin oletuskäsittelijän hoitaa asia
  if (res.headersSent) {
    return next(err);
  }

  // Virheellinen JSON pyynnön rungossa
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Virheellinen JSON.'
    });
  }

  // Todellinen virhe kirjataan palvelimen lokiin, selaimelle ei kerrota yksityiskohtia
  console.error('Unhandled error:', err);

  res.status(500).json({
    error: 'Palvelinvirhe.'
  });
});

export default app;
