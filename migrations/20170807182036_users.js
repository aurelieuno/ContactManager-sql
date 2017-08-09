exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(Date.now());
  }).createTable('contacts', function(table) {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('phone');
    table.integer('user_id').references('users.id');
    table.timestamp('created_at').defaultTo(Date.now());
  })
  .then(function(){
    console.log('Users Table created')
  })
  .catch(function(){
    console.log('There was an error with the users table')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
    .dropTable('contacts')
    .then(() => {
      console.log('users table deleted')
    })
    .catch(() => {
      console.log('there was an error deleting users table')
    })
};

