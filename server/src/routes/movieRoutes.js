import express from 'express';
import { popularMovies, search, movieDetails, createReview } from '../controllers/movieController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Reitti suosituimpien elokuvien hakemiseen
router.get('/popular', popularMovies);

// Reitti elokuvien hakemiseen hakusanalla
router.get('/search', search);

// Reitti yhden elokuvan tietojen hakemiseen
router.get('/:id', movieDetails);

// Reitti elokuvan arvostelun julkaisulle
router.post('/:id/reviews', requireAuth, createReview);

export default router;
