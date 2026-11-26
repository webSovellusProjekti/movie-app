import { test, expect } from '@playwright/test';

// Tämä testi luo käyttäjiä, joten sitä ei ajeta julkaistua Azure-sivua vastaan
test.skip(
  ({ baseURL }) => (baseURL || '').includes('azurewebsites.net'),
  'Ei luoda testikäyttäjiä tuotantotietokantaan'
);

test('rekisteröinti ja kirjautuminen selaimessa', async ({ page }) => {
  const username = `e2e_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'Testi1234!';

  // Rekisteröinti
  await page.goto('/rekisterointi');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="confirmEmail"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);

  const [registerResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/auth/register')),
    page.click('button[type="submit"]')
  ]);
  expect(registerResponse.status()).toBe(201);

  // Kirjautuminen
  await page.goto('/kirjautuminen');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);

  const [loginResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/auth/login')),
    page.click('button[type="submit"]')
  ]);
  expect(loginResponse.status()).toBe(200);

  // Istunto on voimassa: /me palauttaa kirjautuneen käyttäjän
  const me = await page.request.get('/api/auth/me');
  expect(me.status()).toBe(200);
  expect((await me.json()).user.username).toBe(username);

  // Uloskirjautuminen: kirjautuneen navigointi näkyy vasta kun käyttäjä on sisällä
  await page.goto('/');
  await page.getByRole('button', { name: 'Oma tili' }).click();

  const [logoutResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/auth/logout')),
    page.getByRole('button', { name: 'Kirjaudu ulos' }).click()
  ]);
  expect(logoutResponse.status()).toBe(200);

  // Istunto on päättynyt
  const meAfter = await page.request.get('/api/auth/me');
  expect(meAfter.status()).toBe(401);
});
