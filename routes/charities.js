const charitiesRouter = require('express').Router();

charitiesRouter.route('/').get().all()

module.exports = charitiesRouter