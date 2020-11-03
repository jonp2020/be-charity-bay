const Knex = require("knex");
const { categories, users, items, charities } = require("../data/index.js");
exports.seed = (knex) => {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("categories")
        .insert(categories)
        .returning("*")
    })
    .then(() => {
      return knex("charities")
        .insert(charities)
        .returning("*")
    })
    .then(() => {
      return knex("users")
        .insert(users)
        .returning("*")
        .then((users) => {
        });
    })
    .then(() => {
      return knex("items").insert(items).returning("*");
    })
    .catch((err) => {
      console.log(err);
    });
};
