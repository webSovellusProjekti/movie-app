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
