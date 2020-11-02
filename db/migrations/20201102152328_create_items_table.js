exports.up = function (knex) {
  return knex.schema.createTable('items', (itemsTable) => {
    itemsTable.increments('item_id');
    itemsTable.string('thumbnail_img_ref').notNullable();
    itemsTable.string('fullsize_img_ref').notNullable();
    itemsTable.string('title').notNullable();
    itemsTable.integer('price').notNullable();
    itemsTable.integer('seller_id').references('users.user_id').notNullable();
    itemsTable.string('category').references('categories.slug').notNullable();
    itemsTable.string('status').defaultTo('available');
    itemsTable.string('description').notNullable();
    itemsTable
      .integer('charity_id')
      .references('charities.charity_id')
      .notNullable();
    itemsTable.string('location').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('items');
};
