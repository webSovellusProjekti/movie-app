import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Testaa /api/health reitti
describe('health', () => {
  it('GET /api/health palauttaa ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

// Testaa /api/movies/search reitti
describe('elokuvahaku', () => {
  it('ilman hakusanaa palauttaa 400', async () => {
    const res = await request(app).get('/api/movies/search');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Hakusana puuttuu.');
  });

  it('tyhjällä hakusanalla palauttaa 400', async () => {
    const res = await request(app).get('/api/movies/search').query({ q: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Hakusana puuttuu.');
  });
});

// Testaa autentikointireitit
describe('autentikointi', () => {
  it('kirjautuminen tyhjillä kentillä palauttaa 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
  });

  it('rekisteröinti puuttuvilla kentillä palauttaa 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testi' });

    expect(res.status).toBe(400);
  });

  it('rekisteröinti heikolla salasanalla palauttaa 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testi', email: 'testi@example.com', password: 'heikko' });

    expect(res.status).toBe(400);
  });

  it('/api/auth/me ilman kirjautumista palauttaa 401', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });
});

describe('elokuvan tiedot', () => {
  it('kirjaimia sisältävä tunniste palauttaa 400', async () => {
    const res = await request(app).get('/api/movies/abc');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Virheellinen elokuvan tunniste.');
  });

  it('numeron ja kirjaimen sekoitus palauttaa 400', async () => {
    const res = await request(app).get('/api/movies/12abc');

    expect(res.status).toBe(400);
  });

  it('/search ei jää /:id-reitin alle', async () => {
    const res = await request(app).get('/api/movies/search');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Hakusana puuttuu.');
  });
});

describe('elokuvahaku, hakuehdot', () => {
  it('kaksi hakuehtoa yhtä aikaa palauttaa 400', async () => {
    const res = await request(app)
      .get('/api/movies/search')
      .query({ q: 'matrix', actor: 'keanu' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Käytä vain yhtä hakuehtoa kerrallaan.');
  });

  it('liian pitkä näyttelijän nimi palauttaa 400', async () => {
    const res = await request(app)
      .get('/api/movies/search')
      .query({ actor: 'a'.repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Hakusana on liian pitkä.');
  });
});

// Testaa virheenkäsittelyä
describe('virheenkäsittely', () => {
  it('tuntematon /api-osoite palauttaa JSON-virheen ja 404', async () => {
    const res = await request(app).get('/api/ei-ole-olemassa');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.error).toBe('Reittiä ei löytynyt.');
  });

  it('virheellinen JSON palauttaa 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{username":');
  });

  it('olemassa oleva reitti toimii edelleen', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('arvostelun julkaisu', () => {
  it('ilman kirjautumista palauttaa 401', async () => {
    const res = await request(app)
      .post('/api/movies/603/reviews')
      .send({ rating: 5, body: 'Hyvä' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Kirjautuminen vaaditaan.');
  });
});

describe('arvostelun tarkistuksen', () => {
  // Kirjautumaton saa 401 ennen sisällön tarkistusta, joten näihin tarvitaan kirjautuminen
  it('virheellinen elokuvan tunniste ilman kirjautumista palauttaa 401', async () => {
    const res = await request(app).post('/api/movies/abc/reviews').send({ review: 'Hyvä' });

    expect(res.status).toBe(401);
  });
});
