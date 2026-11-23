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

// Hakee yhden elokuvan iedot ja näyttelijät TMDB API:sta
export async function getMovieDetails(id) {
  const apiKey = process.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_TMDB_API_KEY puuttuu');
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    language: 'fi-FI',
    append_to_response: 'credits'
  });

  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?${params}`);

  if (response.status === 404) {
    return null; // Elokuvaa ei löytynyt
  }

  if (!response.ok) {
    throw new Error('TMDB-pyyntö epäonnistui: ${response.status}');
  }

  return response.json();
}

// Hakee elokuvia näyttelijän nimellä: ensin henkilö, sitten elokuvat
export async function searchMoviesByActor(name) {
  const apiKey = process.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_TMDB_API_KEY puuttuu');
  }

  // 1. Etsitään henkilö nimellä
  const personParams = new URLSearchParams({
    api_key: apiKey,
    query: name,
    language: 'fi-FI'
  });

  const personResponse = await fetch(`${TMDB_BASE_URL}/search/person?${personParams}`);

  if (!personResponse.ok) {
    throw new Error(`TMDB-pyyntö epäonnistui: ${personResponse.status}`);
  }

  const personData = await personResponse.json();
  const person = personData.results?.[0];

  // Ketään ei löytynyt
  if (!person) {
    return [];
  }

  // 2. Haetaan henkilön elokuvat suosituimmat järjestyksessä
  const movieParams = new URLSearchParams({
    api_key: apiKey,
    with_cast: String(person.id),
    sort_by: 'popularity.desc',
    language: 'fi-FI'
  });

  const movieResponse = await fetch(`${TMDB_BASE_URL}/discover/movie?${movieParams}`);

  if (!movieResponse.ok) {
    throw new Error(`TMDB-pyyntö epäonnistui: ${movieResponse.status}`);
  }

  const movieData = await movieResponse.json();
  return movieData.results ?? [];
}
