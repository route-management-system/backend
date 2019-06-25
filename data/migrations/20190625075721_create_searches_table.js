
exports.up = function(knex, Promise) {
  return knex.schema.createTable('saves', tbl => {
    tbl.increments();
    tbl
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    tbl
      .float('lat');
    tbl
      .float('lon');
    tbl
      .string('address', 255);    
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('saves')

};
