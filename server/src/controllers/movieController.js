import { getPopularMovies } from '../services/tmdbService.js';

// Hakee suosituimmat elokuvat TMDB API:sta ja palauttaa ne JSON-muodossa
export async function popularMovies(req, res) {
  try {
    const movies = await getPopularMovies();
    return res.status(200).json({ movies });
  } catch (err) {
    console.error('Popular movies failed:', err.message);
    return res.status(502).json({
      error: 'Elokuvien hakeminen epäonnistui.'
    });
  }
}
