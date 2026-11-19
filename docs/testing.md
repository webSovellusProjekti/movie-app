# Testausdokumentaatio

Tila: luonnos. Päivitetään testien lisääntyessä.

## Testausstrategia

- Manuaaliset API-testit (curl): ajetaan paikallisesti Dockerilla ja Azuressa.
- Tuotantobuildin testi: `npm run build` ja `node server/src/index.js`, eli samalla tavalla kuin Azure käynnistää sovelluksen.
- E2E-testit: Playwright (`e2e/`), ajetaan paikallisesti ja Azurea vastaan. Ajo GitHub Actionsissa: suunniteltu, ei vielä toteutettu.
- API-testit automaattisesti: Vitest ja Supertest (`server/tests`), ajetaan paikallissta dockerissa. Ajo GitHub Actionsissa: ei vielä toteutettu.

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
| T7 | Rekisteröinti onnistuu ja salasana tallentuu tiivisteenä | manuaalinen | - | ei testattu |
| T8 | Kirjautuminen onnistuu ja /api/auth/me palauttaa käyttäjän | manuaalinen | - | ei testattu |
| T9 | Kirjautuminen säilyy Azuressa (secure-eväste, trust proxy) | manuaalinen | - | ei testattu |
| T10 | Etusivu näyttää elokuvakortit eikä selaimessa tule virheitä | Playwright | paikallinen, Azure | läpäisty |
| T11 | E2E: rekisteröinti, kirjautuminen ja uloskirjautuminen | Playwright | - | ei toteutettu |
| T12 | Elokuvahaku ilman hakusanaa palauttaa 400, elokuvan virheellinen tunniste palauttaa 400, /search ei jää /:id-reitin alle | automaattinen (Supertest) | paikallinen | läpäisty |
| T13 | Rekisteröinti puuttuvilla kentillä ja heikolla salasanalla sekä kirjautuminen tyhjillä kentillä palauttavat 400, /api/auth/me ilman kirjautumista palauttaa 401 | automaattinen (Supertest) | paikallinen | läpäisty |
| T14 | POST /api/groups ilman kirjautumista palauttaa 401 | automaattinen (Supertest) | paikallinen | läpäisty |
| T15 | POST /api/groups kirjautuneena palauttaa 201 ja tyhjällä nimellä 400 | manuaalinen | paikallinen | läpäisty |
| T16 | Ryhmän luoja tulee ryhmän admin-jäseneksi (group_members) | manuaalinen | paikallinen | läpäisty |
