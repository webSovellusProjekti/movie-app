import { getPopularMovies, searchMovies } from '../services/tmdbService.js';

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

// Hakee elokuvia hakusanalla TMDB API:sta ja palauttaa ne JSON-muodossa
export async function search(req, res) {
  const query = req.query.q;

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      error: 'Hakusana puuttuu.'
    });
  }

  if (query.length > 100) {
    return res.status(400).json({
      error: 'Hakusana on liian pitkä.'
    });
  }

  try {
    const movies = await searchMovies(query.trim());
    return res.status(200).json({ movies });
  } catch (err) {
    console.error('Movie search failed:', err.message);
    return res.status(502).json({
      error: 'Elokuvien hakeminen epäonnistui.'
    });
  }
}
