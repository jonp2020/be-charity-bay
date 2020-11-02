const mailRouter = require('express').Router();

mailRouter.route('/').post().all()


module.exports = mailRouter