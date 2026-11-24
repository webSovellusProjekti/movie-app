import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
  deleteAccount
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rekisteröinti
router.post('/register', register);

// Kirjautuminen
router.post('/login', login);

// Kirjautuneen käyttäjän tiedot (esim profiilia varten)
router.get('/me', requireAuth, getCurrentUser);

// Uloskirjautuminen
router.post('/logout', requireAuth, logout);

// Käyttäjätilin poistaminen
router.delete('/account', requireAuth, deleteAccount);

export default router;
