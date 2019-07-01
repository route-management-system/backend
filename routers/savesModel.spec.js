const db = require('../data/dbConfig.js');

const { add, find, findById, update, remove } = require('./savesModel.js');

describe('Saves model', () => {
  beforeEach(async () => {
    await db('saves').truncate();
  });

  it('should set environment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('find function', () => {
    it('should return an empty array if nothing has been added', async () => {
      let actual = await find();
      let expected = []
      expect(actual).toEqual(expected);
    })
    it('should return an array of saves if saves have been added', async () => {
      let save1 = { user_id: 1, lat: 1234, lon: 5678, address: "123 4th St." };
      let save2 = { user_id: 1, lat: 12234, lon: 56748, address: "1523 4th St." }

      await db('saves').insert(save1);
      await db('saves').insert(save2);

      let saves = await find();
      expect(saves.length).toEqual(2);
      
    })
  })

  describe('add function', () => {
    it('should add a save', async () => {
      let saves = await db('saves');
      let x = saves.length

      await add({ user_id: 1, lat: 1234, lon: 5678, address: "123 4th St." });

      saves = await db('saves');
      expect(saves).toHaveLength(x + 1)
    })

    it('should add the given save', async () => {
      let save = { user_id: 1, lat: 1234, lon: 5678, address: "123 4th St." };
      await add(save)
      let saves = await db('saves');
      const lats = saves.map(save => save.lat)
      const lons = saves.map(save => save.lon)
      expect(lons).toContain(5678)
      expect(lats).toContain(1234)
    })
  })

  describe('remove function', () => {
    it('should remove a save', async () => {
      await add({ user_id: 1, lat: 1234, lon: 5678, address: "123 4th St." });
      await add({ user_id: 1, lat: 1334, lon: 4678, address: "123 2nd St." });
      let saves = await db('saves');
      let x = saves.length

      await remove(1)

      saves = await db('saves');
      expect(saves).toHaveLength(x - 1);
    })

    it('should remove the given save', async () => {
      await add({ user_id: 1, lat: 1234, lon: 5678, address: "123 4th St." });
      await add({ user_id: 1, lat: 1334, lon: 4678, address: "123 2nd St." });
      let saves = await db('saves');
      const id = saves[0].id;
      
      await remove(id);

      saves = await db('saves');
      const ids = saves.map(save => save.id);
      expect(ids).not.toContain(id);
    })
  })
});
