// Vain kirjautunut käyttäjä pääsee kirjautumista vaativiin toimintoihin
// Tarkistaa käyttäjän enne kuin pyyntö pääsee varsinaiseen toimintaan

export function requireAuth(req, res, next) {
  // Tarkistetaan, löytyykö istunnosta käyttäjä
  if (!req.session.user) {
    return res.status(401).json({
      error: 'Kirjautuminen vaaditaan.'
    });
  }

  // Käyttäjä on kirjautunut, jatketaan seuraavaan toimintoon
  next();
}
