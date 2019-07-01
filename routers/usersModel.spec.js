const db = require('../data/dbConfig.js');

const { add, find, findById, update, remove } = require('./usersModel.js');

describe('Users model', () => {

  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('find function', () => {
    it('should return an array', async () => {
      let users = await find();
      expect(users.length).toBeTruthy();
    })
    it('should return an array of users if users have been added', async () => {
      let num = Math.floor(Math.random() * 100000)
      let user = {
        username: `RollFizzlebeef${num}`,
        password: "mst3k"
      };

      let usersInit = await db('users')
      await db('users').insert(user);

      let users = await find();
      expect(users.length).toEqual(usersInit.length + 1);
      
    })
  })
})