const { getCharities } = require('../controllers/charities');
const { withErrorHandling, handle405Error } = require('../errors');

const charitiesRouter = require('express').Router();

charitiesRouter
  .route('/')
  .get(withErrorHandling(getCharities))
  .all(handle405Error);

module.exports = charitiesRouter;
