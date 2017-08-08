var config = require ('./knexfile.js');
var env = 'development';
var knex = require('knex')(config[env]);

module.exports= knex;

knex.migrate.latest([config]);//ensure that the schema of our database is always current.


/*The knex module is itself a function which takes a configuration object for Knex,
accepting a few parameters. The client parameter is required and determines which
client adapter will be used with the library.This is where the database connection is made*/
