// Vastaanottaa ryhmiin liittyvät HTTP-pyynnöt
// Tietokantavirheet välittyvät keskitetylle virheenkäsittelijälle (app.js)
import { createGroup, listGroupsForUser, getGroupForUser, leaveGroup } from '../services/groupService.js';

const VISIBILITIES = ['public', 'private'];

// Ryhmän luonti
export async function create(req, res) {
  const { name, description, visibility = 'public' } = req.body;

  // Nimi on pakollinen
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Ryhmän nimi on pakollinen.'
    });
  }

  // Nimi saa olla enintään 100 merkkiä (tietokannan raja)
  if (name.trim().length > 100) {
    return res.status(400).json({
      error: 'Ryhmän nimi saa olla enintään 100 merkkiä.'
    });
  }

  // Kuvaus on vapaaehtoinen, mutta jos se annetaan, sen pitää olla teksti
  if (description !== undefined && description !== null && typeof description !== 'string') {
    return res.status(400).json({
      error: 'Kuvauksen pitää olla teksti.'
    });
  }

  // Näkyvyys: public tai private
  if (!VISIBILITIES.includes(visibility)) {
    return res.status(400).json({
      error: 'Näkyvyyden pitää olla public tai private.'
    });
  }

  const group = await createGroup({
    name: name.trim(),
    description: description?.trim() || null,
    visibility,
    userId: req.session.user.id
  });

  return res.status(201).json({ group });
}

// Ryhmien listaus kirjautuneelle käyttäjälle
export async function list(req, res) {
  const groups = await listGroupsForUser(req.session.user.id);

  return res.status(200).json({ groups });
}

// Yhden ryhmän tiedot kirjautuneelle käyttäjälle
export async function show(req, res) {
  const { id } = req.params;

  // Vain numeromuotoinen tunniste hyväksytään
  if (!/^\d+$/.test(id)) { // Tarkistaa onko id pelkkä numero
    return res.status(404).json({
      error: 'Virheellinen ryhmän tunniste.'
    });
  }

  const group = await getGroupForUser(id, req.session.user.id);

  // Ryhmää ei ole tai käyttäjä ei saa nähdä sitä
  if (!group) {
    return res.status(404).json({
      error: 'Ryhmää ei löytynyt.'
    });
  }

  return res.status(200).json({ group });
}

// Ryhmästä poistuminen
export async function leave(req, res) {
  const { id } = req.params;

  // Tarkistetaan, että ryhmän tunniste on numero
  if (!/^\d+$/.test(id)) {
    return res.status(404).json({
      error: 'Virheellinen ryhmän tunniste.'
    });
  }

  const result = await leaveGroup({
    groupId: id,
    userId: req.session.user.id
  });

  // Käyttäjä ei ole ryhmän jäsen
  if (result.notMember) {
    return res.status(404).json({
      error: 'Et ole ryhmän jäsen.'
    });
  }

  // Ylläpitäjän poistuessa koko ryhmä poistetaan
  if (result.deleted) {
    return res.status(200).json({
      message: 'Ryhmä poistettu.'
    });
  }

  // Tavallinen jäsen poistui ryhmästä
  return res.status(200).json({
    message: 'Poistuit ryhmästä.'
  });
}
