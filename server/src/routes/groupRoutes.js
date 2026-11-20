import express from 'express';
import { create, list } from '../controllers/groupController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ryhmän luonti, vaatii kirjautumisen
router.post('/', requireAuth, create);

// Ryhmien listaus vaatii kirjautumisen
router.get('/', requireAuth, list);

export default router;
