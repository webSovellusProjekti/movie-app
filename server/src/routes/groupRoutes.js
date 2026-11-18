import express from 'express';
import { create } from '../controllers/groupController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ryhmän luonti, vaatii kirjautumisen
router.post('/', requireAuth, create);

export default router;
