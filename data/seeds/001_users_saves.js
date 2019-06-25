const bcrypt = require("bcrypt");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  knex.raw('SET foreign_key_checks = 0');
  knex.truncate('users', 'saves');
  knex.raw('SET foreign_key_checks = 1')
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "Slab Bulkhead", password: bcrypt.hashSync("mst3k", 12)},
        {username: "Flint Ironstag", password: bcrypt.hashSync("mst3k", 12)},
        {username: "Blast Hardcheese", password: bcrypt.hashSync("mst3k", 12)},
        {username: "Big McLargeHuge", password: bcrypt.hashSync("mst3k", 12), defaultLatitude: 39.3545724, defaultLongitude: -76.7596183},
        {username: "Roll Fizzlebeef", password: bcrypt.hashSync("mst3k", 12)},
      ]);
    })    
    .then(function () {
      // Inserts seed entries
      return knex('saves').insert([
        {user_id: 1, lat: 34.1722663, lon: -118.3340495},
        {user_id: 2, lat: 35.1421277, lon: -106.586562},
        {user_id: 2, lat: 39.9588687, lon: -83.0931843, address: "200 Wilson Road, Columbus, OH 43204, United States of America"},
        {user_id: 3, address: "104 W. Cornelius Harnett Blvd, Lillington, NC 27546"},
        {user_id: 5, lat: 35.3694929, lon: -96.9287558},
        {user_id: 5, lat: 43.5955399, lon: -116.1937734},
        {user_id: 5, lat: 42.2673165, lon: -71.1693118}        
      ]);
    });
};
