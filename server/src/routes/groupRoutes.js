import express from 'express';
import { create, list, show } from '../controllers/groupController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ryhmän luonti, vaatii kirjautumisen
router.post('/', requireAuth, create);

// Ryhmien listaus vaatii kirjautumisen
router.get('/', requireAuth, list);

// Yhden ryhmän tiedot, vaatii kirjautumisen
router.get('/:id', requireAuth, show);

export default router;
