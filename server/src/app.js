// Rakentaa Express-sovelluksen ja määrittelee, mitä se osaa tehdä

import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

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

export default app;
