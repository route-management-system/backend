const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
  findSavesByUser,
  update,
  remove
}

function add(user) {
  return db('users')
    .returning('id')
    .insert(user)
    .then(ids => {
      [id] = ids;
      return findById(id);
    });
}

function find() {
  return db('users')
    .select('id', 'username', 'defaultLongitude', 'defaultLatitude')
}

function findBy(filter) {
  return db('users').where(filter);
}

function findSavesByUser(id) {
  return db('saves')
    .select('saves.id', 'saves.lat', 'saves.lon', 'saves.address')
    .where('saves.user_id', id);
}

function findById(id) {
  return db('users')
    .where("id", id)
    .select('id', 'username', 'defaultLongitude', 'defaultLatitude')
    .first();
}

function update(id, changes) {
  return db('users')
    .where("id", id)
    .update(changes)
    .then(user => {
      if(user > 0) {
        return findById(id);
      } else {
        return null;
      }
    })
}

function remove(id) {
  return db('users')
    .where("id", id)
    .del();
}