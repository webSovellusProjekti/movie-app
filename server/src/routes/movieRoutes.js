import express from 'express';
import { popularMovies, search } from '../controllers/movieController.js';

const router = express.Router();

// Reitti suosituimpien elokuvien hakemiseen
router.get('/popular', popularMovies);

// Reitti elokuvien hakemiseen hakusanalla
router.get('/search', search);

export default router;
