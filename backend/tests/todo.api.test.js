const request = require('supertest');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const { initApp, stopApp } = require('../app');
const { JWT_SECRET } = require('../config/keys');

let app;
let Todo;
let User;

const userData = {
  email: 'john@gmail.com',
  password: 'password123'
};

// Helper: RS256 JWT with { sub } for the middleware
function generateToken(userId) {
  return jsonwebtoken.sign({ sub: userId }, JWT_SECRET, {
    algorithm: 'RS256',
    expiresIn: '1h'
  });
}

beforeAll(async () => {
  const out = await initApp({ listen: false });
  app = out.app;
  Todo = app.locals.models.Todo;
  User = app.locals.models.User;
});

afterAll(async () => {
  await stopApp();
});

describe('Todo API (with auth middleware)', () => {
  test('POST /api/todo → creates a todo', async () => {
    const user = await User.create({
      email: userData.email,
      password: await bcrypt.hash(userData.password, 8)
    });
    const token = generateToken(user.id);

    const res = await request(app)
      .post('/api/todo')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Buy milk' }); // date optional

    expect(res.status).toBe(201);
    expect(res.body.text).toBe('Buy milk');

    const db = await Todo.findOne({ where: { text: 'Buy milk', user_id: user.id } });
    expect(db).toBeTruthy();
    expect(db.user_id).toBe(user.id);
    expect(db.completed).toBe(false);
  });

  test("GET /api/todo → lists current user's todos", async () => {
    const user = await User.create({
      email: 'jane@example.com',
      password: await bcrypt.hash('secret', 8)
    });
    const token = generateToken(user.id);

    await Todo.create({
      text: 'Task A',
      completed: false,
      user_id: user.id,
      date: new Date('2025-01-01')
    });
    await Todo.create({
      text: 'Task B',
      completed: false,
      user_id: user.id,
      date: new Date('2025-01-02')
    });

    const res = await request(app).get('/api/todo').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    const fields = Object.keys(res.body[0] || {});
    expect(fields).not.toContain('user_id'); // controller hides user_id on list
    const texts = res.body.map((t) => t.text);
    expect(texts).toEqual(expect.arrayContaining(['Task A', 'Task B']));
  });

  test('PATCH /api/todo/:id → updates a todo', async () => {
    const user = await User.create({
      email: 'bob@example.com',
      password: await bcrypt.hash('pass', 8)
    });
    const token = generateToken(user.id);

    const todo = await Todo.create({
      text: 'Old text',
      completed: false,
      user_id: user.id,
      date: new Date('2025-01-03')
    });

    const res = await request(app)
      .patch(`/api/todo/${todo.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'New text', completed: true });

    expect(res.status).toBe(200);
    const db = await Todo.findByPk(todo.id);
    expect(db.text).toBe('New text');
    expect(db.completed).toBe(true);
  });

  test('DELETE /api/todo/:id → deletes a todo', async () => {
    const user = await User.create({
      email: 'del@example.com',
      password: await bcrypt.hash('pass', 8)
    });
    const token = generateToken(user.id);

    const todo = await Todo.create({
      text: 'To delete',
      completed: false,
      user_id: user.id
    });

    const res = await request(app)
      .delete(`/api/todo/${todo.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(await Todo.findByPk(todo.id)).toBeNull();
  });

  // Optional: 401/403 checks to cover the middleware behavior
  test('GET /api/todo → 401 without token', async () => {
    const res = await request(app).get('/api/todo');
    expect(res.status).toBe(401);
  });

  test('GET /api/todo → 403 with invalid token', async () => {
    const res = await request(app)
      .get('/api/todo')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(403);
  });
});
