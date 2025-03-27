const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

describe('Health Check API', () => {
  beforeAll(async () => {
    await pool.getConnection(); // Test DB connection
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should return 200 and OK status when healthy', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toEqual({
      status: 'OK',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
      database: 'connected'
    });
  });

  it('should return 503 when database is down', async () => {
    // Temporarily close pool to simulate DB failure
    await pool.end();

    const res = await request(app)
      .get('/api/health')
      .expect(503);

    expect(res.body.status).toBe('Service Unavailable');
    expect(res.body.database).toBe('disconnected');
  });
});
