import express from 'express';
import { popularMovies, search, movieDetails } from '../controllers/movieController.js';

const router = express.Router();

// Reitti suosituimpien elokuvien hakemiseen
router.get('/popular', popularMovies);

// Reitti elokuvien hakemiseen hakusanalla
router.get('/search', search);

// Reitti yhden elokuvan tietojen hakemiseen
router.get('/:id', movieDetails);

export default router;
