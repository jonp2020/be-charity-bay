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
        .then((categories) => {
        //   console.log(categories);
        });
    })
    .then(() => {
      return knex("charities")
        .insert(charities)
        .returning("*")
        .then((charities) => {
          console.log(charities);
        });
    })
    .then(() => {
      return knex("users")
        .insert(users)
        .returning("*")
        .then((users) => {
        //   console.log(users);
        });
    })
    .then(() => {
      return knex("items").insert(items).returning("*");
    })
    .catch((err) => {
      console.log(err);
    });
};
