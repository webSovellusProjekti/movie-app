# Testausdokumentaatio

Tila: luonnos. Päivitetään testien lisääntyessä.

## Testausstrategia

- Manuaaliset API-testit (curl): ajetaan paikallisesti Dockerilla ja Azuressa.
- Tuotantobuildin testi: `npm run build` ja `node server/src/index.js`, eli samalla tavalla kuin Azure käynnistää sovelluksen.
- E2E-testit: Playwright (`e2e/`), ajetaan paikallisesti, Azurea vastaan ja GitHub Actionsissa (`.github/workflows/e2e.yml`) jokaisessa pull requestissa ja pushissa mainiin.
- API-testit automaattisesti: Vitest ja Supertest (`server/tests`), ajetaan paikallisesti Dockerissa ja GitHub Actionsissa (`.github/workflows/tests.yml`) jokaisessa pull requestissa ja pushissa mainiin.

## Testien ajaminen

Paikallinen ympäristö:

```
docker compose up -d --build
docker compose ps
```

Tuotantobuild ilman Dockeria:

```
npm --prefix client ci
npm --prefix server ci
npm run build
PORT=3002 DB_HOST=localhost SESSION_SECRET=local-test node server/src/index.js
```

API-testit (Vitest ja Supertest):

```
docker compose up -d
docker compose exec backend npm test
```

E2E-testit (Playwright), paikallista Docker-ympäristöä vastaan:

```
docker compose up -d
cd e2e && npm test
```

E2E-testit Azurea vastaan:

```
cd e2e && E2E_BASE_URL=https://movie-app-2026-d2dcfqeycwafhca3.swedencentral-01.azurewebsites.net npm test
```

GitHub Actions ajaa molemmat testityypit automaattisesti Postgres-palvelukontilla ja `server/db/schema.sql`-skeemalla. Epäonnistunut E2E-ajo tallentaa Playwrightin tulokset artefaktiksi (`playwright-results`). Palvelinta vastaan tehtävät E2E-testit käyttävät GitHub-salaisuutta `VITE_TMDB_API_KEY`.

## Testitapaukset

Tila-sarake: läpäisty = ajettu ja toimi, ei testattu = ei vielä ajettu.

| ID | Kuvaus | Tyyppi | Ympäristö | Tila |
|----|--------|--------|-----------|------|
| T1 | GET /api/health palauttaa {"status":"ok"} | manuaalinen | paikallinen, Azure | läpäisty |
| T2 | GET /api/health/db palauttaa {"status":"ok","database":"connected"} | manuaalinen | paikallinen, Azure | läpäisty |
| T3 | POST /api/auth/login tuntemattomalla käyttäjällä palauttaa virheilmoituksen | manuaalinen | paikallinen, Azure | läpäisty |
| T4 | GET /api/movies/popular palauttaa elokuvat (TMDB palvelimen kautta) | manuaalinen | paikallinen | läpäisty |
| T5 | Tuotantobuild: Express tarjoilee Reactin (HTTP 200 osoitteessa /) | manuaalinen | paikallinen | läpäisty |
| T6 | Skeema latautuu tyhjään tietokantaan (8 taulua) | manuaalinen | paikallinen, Azure | läpäisty |
| T7 | Rekisteröinti onnistuu selaimessa ja käyttäjä tallentuu tietokantaan | Playwright | Paikallinen, CI | läpäisty |
| T8 | Kirjautuminen onnistuu selaimessa ja /api/auth/me palauttaa käyttäjän | Playwright | paikallinen, CI | läpäisty |
| T9 | Kirjautuminen säilyy Azuressa (secure-eväste, trust proxy): kirjautuminen palautti 200 ja Set-Cookie-otsakkeen (HttpOnly, Secure, SameSite=Lax) | manuaalinen | Azure | läpäisty |
| T10 | Etusivu näyttää elokuvakortit eikä selaimessa tule virheitä | Playwright | paikallinen, Azure | läpäisty |
| T11 | E2E: rekisteröinti, kirjautuminen ja uloskirjautuminen (/api/auth/me palauttaa 401 kirjautumisen jälkeen) | Playwright | paikallinen, CI | läpäisty |
| T12 | Elokuvahaku ilman hakusanaa palauttaa 400, elokuvan virheellinen tunniste palauttaa 400, /search ei jää /:id-reitin alle | automaattinen (Supertest) | paikallinen | läpäisty |
| T13 | Rekisteröinti puuttuvilla kentillä ja heikolla salasanalla sekä kirjautuminen tyhjillä kentillä palauttavat 400, /api/auth/me ilman kirjautumista palauttaa 401 | automaattinen (Supertest) | paikallinen | läpäisty |
| T14 | POST /api/groups ilman kirjautumista palauttaa 401 | automaattinen (Supertest) | paikallinen | läpäisty |
| T15 | POST /api/groups kirjautuneena palauttaa 201 ja tyhjällä nimellä 400 | manuaalinen | paikallinen | läpäisty |
| T16 | Ryhmän luoja tulee ryhmän admin-jäseneksi (group_members) | manuaalinen | paikallinen | läpäisty |
