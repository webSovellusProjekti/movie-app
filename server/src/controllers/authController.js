// Vastaanottaa frontendiltä tulevat HTTP-pyynnöt

import {
  registerUser,
  authenticateUser,
  getUserById
} from '../services/authService.js';

function createSession(req, user) {
  return new Promise((resolve, reject) => {
    // Luodaan uusi istunto
    req.session.regenerate((err) => {
      if (err) {
        return reject(err);
      }

      // Tallennetaan käyttäjän tiedot istuntoon
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      // Varmistetaan, että istunto tallentuu
      req.session.save((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}

// Rekisteröinti
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Tarkistetaan, että kaikki tarvittavat tiedot annettiin
    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Kaikki kentät ovat pakollisia.'
      });
    }

    // Tarkistetaan salasanan vaatimukset myös backendissä
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Salasanan tulee sisältää vähintään 8 merkkiä, iso ja pieni kirjain, numero sekä erikoismerkki.'
      });
    }

    const user = await registerUser({
      username: username.trim(),
      email: email.trim(),
      password
    });

    return res.status(201).json({
      message: 'Rekisteröinti onnistui.',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    // PostgreSQLin virhekoodi 23505 tarkoittaa yksilöllisen arvon ristiriitaa
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Käyttäjänimi tai sähköpostiosoite on jo käytössä.'
      });
    }

    console.error('Registration failed:', err);

    return res.status(500).json({
      error: 'Rekisteröinti epäonnistui.'
    });
  }
}

// Kirjautuminen
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Käyttäjänimi ja salasana ovat pakollisia.'
      });
    }

    const user = await authenticateUser(username.trim(), password);

    // Sama virheilmoitus riippumatta siitä, kumpi tieto on väärin
    if (!user) {
      return res.status(401).json({
        error: 'Virheellinen käyttäjänimi tai salasana.'
      });
    }

    // Luodaan käyttäjälle istunto
    await createSession(req, user);

    // Sähköpostia ei palauteta kirjautumisvastauksessa, koska se on yksityinen
    return res.status(200).json({
      message: 'Kirjautuminen onnistui.',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login failed:', err);

    return res.status(500).json({
      error: 'Kirjautuminen epäonnistui.'
    });
  }
}

// Hakee kirjautuneen käyttäjän tiedot
export async function getCurrentUser(req, res) {
  try {
    const user = await getUserById(req.session.user.id);

    // Käyttäjää ei enää löydy tietokannasta
    if (!user) {
      return res.status(404).json({
        error: 'Käyttäjää ei löytynyt.'
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Fetching current user failed:', err);

    return res.status(500).json({
      error: 'Käyttäjätietojen hakeminen epäonnistui.'
    });
  }
}

// Uloskirjautuminen
export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);

      return res.status(500).json({
        error: 'Uloskirjautuminen epäonnistui.'
      });
    }

    // Poistetaan selaimesta istuntoeväste
    res.clearCookie('connect.sid');

    return res.status(200).json({
      message: 'Uloskirjautuminen onnistui.'
    });
  });
}
