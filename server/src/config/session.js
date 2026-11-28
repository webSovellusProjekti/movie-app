// luodaan kirjautuneelle henkilölle istunto
// kirjautuminen muistetaan kaikilla sivulatauksilla

import session from 'express-session'; // huolehtii istuntojen luomisesta ja hallinnasta
import connectPgSimple from 'connect-pg-simple'; // mahdollistaa istuntojen tallentamisen PostgreSQL-tietokantaan
import { pool } from '../db.js';

const PgSession = connectPgSimple(session); // istunto tallennetaan tietokantaan

export const sessionMiddleware = session({
  store: new PgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
    ttl: 60 * 30 // session voimassaoloaika tietokannassa: 30 min
  }),

  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,
  rolling: true,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30
  }
});
