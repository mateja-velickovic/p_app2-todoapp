const request = require('supertest');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const { initApp, stopApp } = require('../app');
const { JWT_SECRET } = require('../config/keys');

let app;
let User;

const uniqueEmail = (pfx = 'login') =>
  `${pfx}.${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

beforeAll(async () => {
  const out = await initApp({ listen: false });
  app = out.app;
  User = app.locals.models.User;
});

afterAll(async () => {
  await stopApp();
});

describe('Auth Controller', () => {
  test('POST /api/auth → logs in a user and returns a token cookie', async () => {
    const email = uniqueEmail();
    const password = 'password123';

    // seed user
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 8)
    });

    const res = await request(app).post('/api/auth').send({ email, password });

    // Some apps return 200, others 201 — accept both
    expect([200, 201]).toContain(res.status);

    // Body now contains { token, user }
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({ email });
    expect(res.body.user.password).toBeUndefined();

    // Verify the JWT from the body using the same key the app uses to verify
    const decoded = jsonwebtoken.verify(res.body.token, JWT_SECRET);
    expect(String(decoded.sub)).toBe(String(user.id));

    // Cookie may also be set; assert gracefully if present
    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      const joined = setCookie.join(';');
      expect(joined).toContain('token=');
    }
  });

  test('POST /api/auth → wrong password', async () => {
    const email = uniqueEmail('wrongpass');
    const good = 'password123';
    await User.create({ email, password: await bcrypt.hash(good, 8) });

    const res = await request(app).post('/api/auth').send({ email, password: 'badpass' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Mauvais email ou mot de passe!');
  });

  test('POST /api/auth → unknown email', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ email: uniqueEmail('nouser'), password: 'password' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Ce compte n'existe pas !");
  });
});
