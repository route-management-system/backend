const db = require('../data/dbConfig.js');

module.exports = {
  add,
  find,
  findById,
  update,
  remove
}

function add(save) {
  return db('saves')
    .returning('id')
    .insert(save)
    .then(ids => {
      [id] = ids;
      return findById(id);
    });
}

function find() {
  return db('saves')
}

function findById(id) {
  return db('saves')
    .where("id", id)
    .first();
}

function update(id, changes) {
  return db('saves')
    .where("id", id)
    .update(changes)
    .then(save => {
      if(save > 0) {
        return findById(id);
      } else {
        return null;
      }
    })
}

function remove(id) {
  return db('saves')
    .where("id", id)
    .del();
}