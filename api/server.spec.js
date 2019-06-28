const supertest = require('supertest');

const db = require('../data/dbConfig.js');
const server = require('./server.js');

describe('server', () => {
  describe('GET / (basic test)', () => {
    it('responds 200', async () => {
      await supertest(server)
        .get('/')
        .expect(200);
    });
  })
});