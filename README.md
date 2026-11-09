# movie-app

Julkaistu sovellus: https://movie-app-2026-d2dcfqeycwafhca3.swedencentral-01.azurewebsites.net/

## rakenne

- `client/`: React frontend (Vite)
- `server/`: Express backend
- `docs/`: vaatimukset, tekniset dokumentit, testausdokumentit (Markdown, kaaviot mallia Mermaid)

## vaatimukset

- Node.js 20 tai uudempi
- PostgreSQL (asennusohjeet TBD)

## asennus

```
git clone https://github.com/webSovellusProjekti/movie-app.git
cd movie-app
cp server/.env.example server/.env # muokkaa .env-tiedostoa tarpeen mukaan
cd server && npm install
cd ../client && npm install
```

## ajaminen Dockerilla

Vaatimus: Docker (Desktop tai Engine + Compose).

Ensimmäinen käynnistys:

```
cp .env.example .env
docker compose up --build
```

Docker käynnistää kolme palvelua:

- `frontend`: React/Vite, http://localhost:5173
- `backend`: Express, http://localhost:3001 (tarkistus: http://localhost:3001/api/health)
- `database`: PostgreSQL, `localhost:5432`, tietokanta `movieapp`

Kehitysasetukset (käyttäjä `postgres`, salasana `root`) on vain paikalliseen käyttöön. `.env`-tiedostoa ei commitoida.

Backend yhdistää tietokantaan osoitteella `database:5432`, ei `localhost:5432`. Docker Composen palvelun nimi toimii konttien välillä osoitteena.

### Tavalliset komennot

| Komento | Mitä tekee |
|---------|------------|
| `docker compose up -d` | Käynnistää taustalle |
| `docker compose ps` | Näyttää palvelujen tilan |
| `docker compose logs -f backend` | Seuraa backendin lokia |
| `docker compose down` | Pysäyttää, tietokanna data säilyy |
| `docker compose down -v` | Pysäyttää ja poistaa tietokannan datan |

Koodimuutokset päivittyvät konttiin automaattisesti (frontend: Vite, backend: nodemon).

### Tietokannan skeema

`server/db/`-kansion `.sql`-tiedostot ajetaan vain, kun PostgreSQL luo uuden tyhjän tietokantavolumen. Skeeman muutos ei päivity olemassa olevaan tietokantaan. Luo tietokanta alusta (poistaa paikallisen datan):

```
docker compose down -v
docker compose up --build
```

### Ongelmatilanteet

- Portti 5432 on varattu: vaihda `.env`-tiedostossa `DB_EXPOSED_PORT=5433` ja käynnistä uudelleen. Backend ei tarvitse muutosta.
- Lisäsit npm-riippuvuuden: aja `docker compose up --build --renew-anon-volumes`, muuten kontin `node_modules` ei päivity.
- Muutit `.env`-tiedostoa: aja `docker compose up -d` uudelleen.
- Palvelu ei käynnisty: `docker compose ps` ja `docker compose logs <palvelu>`.

## ajaminen development-tilassa

Terminaali 1:

```
cd server && npm run dev
```

Terminaali 2:

```
cd client && npm run dev
```

Clientin pitäisi olla nyt saatavilla osoitteessa `http://localhost:5173`. Proxy välittää `/api`-kutsut serverille portissa 3001.

## työnkulku

- `main` on "suojattu": ei pusketa suoraan tähän, muutokset tehdään pull requesteina
- Esimerkiksi `omanimi-dev` branchilla tehdään muutokset, ja kun se on valmis, tehdään pull request mainiin. Pull requestin hyväksyy toinen tiimin jäsen.

## Julkaistu Azureen

Sovellus ajetaan yhdessä Azure App Service -web-sovelluksessa (Node 24, Linux). Express tarjoilee sekä API:n että valmiiksi käännetyn Reactin (`client/dist`) samasta osoitteesta. Tietokanta on Azure Database for PostgreSQL flexible server.

Osoite: https://movie-app-2026-d2dcfqeycwafhca3.swedencentral-01.azurewebsites.net/

Tarkistus: `api/health` (palvelin) ja `/api/health/db` (tietokantayhteys).

### Miten julkaisu toimii

- Push `main`-haaraan käynnistää GitHub Actions -workflowin (`.github/workflows/`). Se asentaa riippuvuudet, ajaa `npm run build` ja vie paketin App serviceen.
- Juuren `package.json` sisältää Azuren tarvitsemat skriptit: `build` (kääntää clientin) ja `start` (käynnistää Expressin).

### Azuren asetukset

App Servicen Environment variables -kohdassa on seuraavat asetukset: `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` ja `DB_SSL`. Arvot ovat vain Azuressa. Salasanaa ei kirjoiteta koodiin, READMEen eikä GitHubiin. `PORT`-asetusta ei lisätä, koska App Service antaa sen itse.

### Tietokannan skeema Azuressa

`server/db/schema.sql` ei aja itsestään Azuressa. Skeeman muutokset ajetaan tietokantaan erikseen (esimerkiksi DBeaverilla tai `psql`-komennolla). Älä aja koko tiedostoa uudelleen olemassa olevaan tietokantaan, koska taulut ovat jo olemassa.
