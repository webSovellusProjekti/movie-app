import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/db.js';

// Jokainen ajo käyttää omaa etuliitettä, joten ajot eivät törmää toisiinsa
const prefix = `tf${Date.now()}`;
const password = 'Testi123!';

async function createUser(name) {
  const agent = request.agent(app);
  const username = `${prefix}_${name}`;

  await agent
    .post('/api/auth/register')
    .send({ username, email: `${username}@example.com`, password })
    .expect(201);

  await agent.post('/api/auth/login').send({ username, password }).expect(200);

  return agent;
}

describe('ryhmien kulku kahdella käyttäjällä', () => {
  let a;
  let b;
  let publicId;
  let privateId;

  beforeAll(async () => {
    a = await createUser('a');
    b = await createUser('b');

    const pub = await a.post('/api/groups').send({ name: 'Julkinen', visibility: 'public' });
    const priv = await a.post('/api/groups').send({ name: 'Yksityinen', visibility: 'private' });

    publicId = pub.body.group.id;
    privateId = priv.body.group.id;
  });

  afterAll(async () => {
    // Ryhmät ensin, koska created_by viittaa käyttäjiin
    await pool.query(
      `DELETE FROM groups WHERE created_by IN (SELECT id FROM users WHERE username LIKE $1)`,
      [`${prefix}%`]
    );
    await pool.query(`DELETE FROM users WHERE username LIKE $1`, [`${prefix}%`]);
  });

  it('luoja näkee molemmat ryhmänsä listassa', async () => {
    const res = await a.get('/api/groups');
    const ids = res.body.groups.map((g) => g.id);

    expect(ids).toContain(publicId);
    expect(ids).toContain(privateId);
  });

  it('ulkopuolinen näkee listassa vain julkisen ryhmän', async () => {
    const res = await b.get('/api/groups');
    const ids = res.body.groups.map((g) => g.id);

    expect(ids).toContain(publicId);
    expect(ids).not.toContain(privateId);
  });

  it('ulkopuolinen saa yksityisestä ryhmästä 404', async () => {
    const res = await b.get(`/api/groups/${privateId}`);

    expect(res.status).toBe(404);
  });

  it('ulkopuolinen ei näe julkisen ryhmän jäsenlistaa eikä sähköposteja', async () => {
    const res = await b.get(`/api/groups/${publicId}`);

    expect(res.status).toBe(200);
    expect(res.body.group.is_member).toBe(false);
    expect(res.body.group.members).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain('@example.com');
  });

  it('julkiseen ryhmään voi liittyä, toinen kerta palauttaa 409', async () => {
    const first = await b.post(`/api/groups/${publicId}/join`);
    const second = await b.post(`/api/groups/${publicId}/join`);

    expect(first.status).toBe(201);
    expect(second.status).toBe(409);
  });

  it('liittymisen jälkeen jäsen näkee jäsenlistan', async () => {
    const res = await b.get(`/api/groups/${publicId}`);

    expect(res.body.group.is_member).toBe(true);
    expect(res.body.group.members).toHaveLength(2);
  });

  it('yksityiseen ryhmään ei voi liittyä', async () => {
    const res = await b.post(`/api/groups/${privateId}/join`);

    expect(res.status).toBe(404);
  });
});
