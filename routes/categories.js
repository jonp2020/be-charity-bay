const categoriesRouter = require('express').Router();
const { getCategories } = require('../controllers/charities');
const { withErrorHandling } = require('../errors')

categoriesRouter.route('/').get(withErrorHandling(getCategories)).all();

module.exports = categoriesRouter