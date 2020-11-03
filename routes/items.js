const itemsRouter = require('express').Router();

itemsRouter.route("/").get().post().all();
itemsRouter.route("/:item_id").get().patch().delete().all();


module.exports = itemsRouter