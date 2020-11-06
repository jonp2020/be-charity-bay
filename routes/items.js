const {
  getItems,
  postItem,
  getItemById,
  patchItemById,
  deleteItemById,
} = require('../controllers/items');
const { withErrorHandling, handle405Error } = require('../errors');
const itemsRouter = require('express').Router();

itemsRouter
  .route('/')
  .get(withErrorHandling(getItems))
  .post(withErrorHandling(postItem))
  .all(handle405Error);

itemsRouter
  .route('/:item_id')
  .get(withErrorHandling(getItemById))
  .patch(withErrorHandling(patchItemById))
  .delete(withErrorHandling(deleteItemById))
  .all(handle405Error);

module.exports = itemsRouter;
