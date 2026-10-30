# movie-app

Julkaistu sovellus: https://salmon-sea-01ddb8b03.5.azurestaticapps.net

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
