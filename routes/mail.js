const mailRouter = require('express').Router();
const { postMail } = require('../controllers/mail');
const { withErrorHandling, handle405Error } = require('../errors');


mailRouter.route('/').post(withErrorHandling(postMail)).all(handle405Error)




module.exports = mailRouter