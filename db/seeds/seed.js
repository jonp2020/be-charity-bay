const { categories, users, items, charities } = require('../data/index.js');
exports.seed = (knex) => {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return Promise.all([
        knex('categories').insert(categories).returning('*'),
        knex('charities').insert(charities).returning('*'),
        knex('users').insert(users).returning('*'),
      ]);
    })
    .then(() => {
      return knex('items').insert(items).returning('*');
    });
};
