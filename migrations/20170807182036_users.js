exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email');
    table.string('password');
  }).createTable('contacts', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('phone');
    table.integer('user_id').references('users.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
    .dropTable('contacts')
};

