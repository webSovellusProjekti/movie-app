// Vastaanottaa ryhmiin liittyvät HTTP-pyynnöt
import { createGroup, listGroupsForUser } from '../services/groupService.js';

const VISIBILITIES = ['public', 'private'];

// Ryhmän luonti
export async function create(req, res) {
  try {
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
  } catch (err) {
    console.error('Group creation failed:', err);

    return res.status(500).json({
      error: 'Ryhmän luonti epäonnistui.'
    });
  }
}

// Ryhmien listaus kirjautuneelle käyttäjälle
export async function list(req, res) {
  try {
    const groups = await listGroupsForUser(req.session.user.id);

    return res.status(200).json({ groups });
  } catch (err) {
    console.error('Listing groups failed:', err);

    return res.status(500).json({
      error: 'Ryhmien hakeminen epäonnistui.'
    });
  }
}
