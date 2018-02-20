
exports.up = knex => knex.schema.createTable('jogs', table => {
  table.increments();
  table.integer('user_id').notNullable();
  table.integer('distance').notNullable();
  table.integer('duration').notNullable();
  table.date('date').notNullable();
  table.timestamps();
});

exports.down = knex => knex.schema.dropTable('jogs');
