import { getPopularMovies, searchMovies, getMovieDetails, searchMoviesByActor } from '../services/tmdbService.js';
import { createReview as saveReview } from '../services/reviewService.js'

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

// Hakee elokuvia hakusanalla: q = elokuvan nimi, actor = näyttelijän nimi
export async function search(req, res) {
  const { q, actor } = req.query;

  // Täsmälleen yksi hakuehto kerrallaan
  const hasTitle = typeof q === 'string' && q.trim() !== '';
  const hasActor = typeof actor === 'string' && actor.trim() !== '';

  if (!hasTitle && !hasActor) {
    return res.status(400).json({
      error: 'Hakusana puuttuu.'
    });
  }

  if (hasTitle && hasActor) {
    return res.status(400).json({
      error: 'Käytä vain yhtä hakuehtoa kerrallaan.'
    });
  }

  const term = hasTitle ? q : actor;

  if (term.length > 100) {
    return res.status(400).json({
      error: 'Hakusana on liian pitkä.'
    });
  }

  try {
    const movies = hasTitle
      ? await searchMovies(term.trim())
      : await searchMoviesByActor(term.trim());

    return res.status(200).json({ movies });
  } catch (err) {
    console.error('Movie search failed:', err.message);
    return res.status(502).json({
      error: 'Elokuvien hakeminen epäonnistui.'
    });
  }
}

// Hakee yhden elokuvan teidot ja näyttelijät TMDB API:sta ja palauttaa ne JSON-muodossa
export async function movieDetails(req, res) {
  const { id } = req.params;

  // Vain numeromuotoinen tunniste hyväksytään
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Virheellinen elokuvan tunniste.'
    });
  }

  try {
    const movie = await getMovieDetails(id);

    if (!movie) {
      return res.status(404).json({
        error: 'Elokuvaa ei löytynyt.'
      });
    }

    return res.status(200).json({ movie });
  } catch (err) {
    console.error('Movie details failed: ', err.message);
    return res.status(502).json({
      error: 'Elokuvan tietojen hakeminen epäonnistui.'
    });
  }
}

// Tallentaa käyttäjän julkisen arvostelun
export async function createReview(req, res) {
  const { id } = req.params;
  const { review } = req.body;

  // Tarkistetaan elokuvan tunniste
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Virheellinen elokuvan tunniste.'
    });
  }

  // Tarkistetaan arvostelun sisältö
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({
      error: 'Arvostelu ei voi olla tyhjä.'
    });
  }

  if (review.length > 5000) {
    return res.status(400).json({
      error: 'Arvostelu voi sisältää enintään 5000 merkkiä.'
    });
  }

  // Estetään HTML-tagit
  if (/<[^>]*>/.test(review)) {
    return res.status(400).json({
      error: 'Arvostelu ei voi sisältää HTML-tageja.'
    });
  }

  // Estetään linkit
  if (/(https?:\/\/|www\.)/i.test(review)) {
    return res.status(400).json({
      error: 'Arvostelu ei voi sisältää linkkejä.'
    });
  }

  try {
    const savedReview = await saveReview({
      tmdbId: Number(id),
      userId: req.session.user.id,
      body: review.trim()
    });

    return res.status(201).json({
      message: 'Arvostelu julkaistiin onnistuneesti.',
      review: savedReview
    });

  } catch (err) {
    // Käyttäjä on jo arvostellut saman elokuvan
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Olet jo julkaissut arvostelun tästä elokuvasta.'
      });
    }

    console.error('Creating review failed:', err);

    return res.status(500).json({
      error: 'Arvostelun julkaiseminen epäonnistui.'
    });
  }
}

