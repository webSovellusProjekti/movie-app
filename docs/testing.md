# Testausdokumentaatio

Tila: luonnos. Päivitetään testien lisääntyessä.

## Testausstrategia

- Manuaaliset API-testit (curl): ajetaan paikallisesti Dockerilla ja Azuressa.
- Tuotantobuildin testi: `npm run build` ja `node server/src/index.js`, eli samalla tavalla kuin Azure käynnistää sovelluksen.
- E2E-testit: (Playwright, ajo GitHub Actionsissa): suunniteltu, ei vielä toteutettu.
- API-testit automaattisesti: suunniteltu, ei vielä toteutettu.

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

Playwright-testien ajokomennot lisätään, kun testit on otettu käyttöön.

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
| T10 | Etusivu näyttää elokuvat Azuressa | manuaalinen | - | ei läpäisty, korjaus PR #69 ja Home.jsx |
| T11 | E2E: rekisteröinti, kirjautuminen ja uloskirjautuminen | Playwright | - | ei toteutettu |
