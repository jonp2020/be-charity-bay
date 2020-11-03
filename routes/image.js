const imageRouter = require('express').Router();
const { postImage, delImageById } = require('../controllers/image');
const { withErrorHandling } = require('../errors')

imageRouter.route('/').post(withErrorHandling(postImage)).all();
imageRouter.route('/:image_id').delete(withErrorHandling(delImageById)).all();


module.exports = imageRouter