import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Testit ryhmien luontiin liittyen
describe('ryhmän luonti', () => {
  it('ilman kirjautumista palauttaa 401', async () => {
    const res = await request(app)
      .post('/api/groups')
      .send({ name: 'Testiryhmä' });

    expect(res.status).toBe(401);
  });

  it('kirjautumattomana ei pääse nimen tarkistukseen asti', async () => {
    const res = await request(app).post('/api/groups').send({});

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Kirjautuminen vaaditaan.');
  });
});

describe('ryhmien listaus', () => {
  it('ilman kirjautumista palauttaa 401', async () => {
    const res = await request(app).get('/api/groups');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Kirjautuminen vaaditaan.');
  });
});
