const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Hakee suosituimmat elokuvat TMDB API:sta
export async function getPopularMovies() {
  const apiKey = process.env.VITE_TMDB_API_KEY;

  // Tarkastaa, että API avain on asetettu muuttujiin
  if (!apiKey) {
    throw new Error('VITE_TMDB_API_KEY puuttuu');
  }

  // Pyyntö TMDB API:lle
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=fi-FI`
  );

  // Tarkastaa, että onnistuiko pyyntö
  if (!response.ok) {
    throw new Error(`TMDB-pyyntö epäonnistui: ${response.status}`);
  }

  // Parsitaan vastaus JSON-muotoon
  const data = await response.json();
  return data.results ?? [];
}

// Hakee elokuvia nimen perusteella TMDB API:sta
export async function searchMovies(query) {
  const apiKey = process.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_TMDB_API_KEY puuttuu');
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    query,
    language: 'fi-FI'
  });

  const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);

  if (!response.ok) {
    throw new Error(`TMDB-pyyntö epäonnistui: ${response.status}`);
  }

  const data = await response.json();
  return data.results ?? [];
}
