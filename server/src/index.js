// Ottaa sovelluksen käyttöön, tarjoilee frontendin ja käynnistää palvelimen

import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import app from './app.js';

const PORT = process.env.PORT || 3001;

// Määritetään React-frontendin dist-kansion sijainti
const clientDist = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../client/dist'
);

// Tarjoillaan frontend, jos dist-kansio löytyy
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Käynnistetään palvelin
// const clientDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
