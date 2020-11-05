const { getItems, postItem } = require('../controllers/items');
const { withErrorHandling, handle405Error } = require('../errors');
const itemsRouter = require('express').Router();

itemsRouter
  .route('/')
  .get(withErrorHandling(getItems))
  .post(withErrorHandling(postItem))
  .all(handle405Error);
itemsRouter.route('/:item_id').get().patch().delete().all();

module.exports = itemsRouter;
