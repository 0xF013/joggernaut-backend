const bcrypt = require('bcrypt-nodejs');

exports.up = knex => knex.schema.createTable('users', table => {
  table.increments();
  table.string('name').notNullable();
  table.string('email').notNullable();
  table.string('password').notNullable();
  table.specificType('roles', 'text[]');
  table.string('access_token');
  table.timestamps();
}).then(() => knex('users').insert({
  name: 'Admin',
  email: 'admin@joggernaut',
  password: bcrypt.hashSync('$idkfa322#'),
  roles: ['user_manager', 'admin'],
  created_at: new Date()
}));

exports.down = knex => knex.schema.dropTable('users');
