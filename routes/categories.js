const categoriesRouter = require('express').Router();
const { getCategories } = require('../controllers/categories');
const { withErrorHandling, handle405Error } = require('../errors');

categoriesRouter
  .route('/')
  .get(withErrorHandling(getCategories))
  .all(handle405Error);

module.exports = categoriesRouter;
