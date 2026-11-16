import express from 'express';
import { popularMovies } from '../controllers/movieController.js';

const router = express.Router();

// Reitti suosituimpien elokuvien hakemiseen
router.get('/popular', popularMovies);

export default router;
