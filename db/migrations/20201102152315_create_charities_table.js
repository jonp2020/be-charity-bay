exports.up = function (knex) {
  return knex.schema.createTable('charities', (charitiesTable) => {
    charitiesTable.increments('charity_id');
    charitiesTable.string('name').notNullable();
    charitiesTable.string('description').notNullable();
    charitiesTable.string('location').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('charities');
};
