const categoriesRouter = require('express').Router();

categoriesRouter.route('/').get().all();

module.exports = categoriesRouter