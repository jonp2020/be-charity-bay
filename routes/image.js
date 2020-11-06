const imageRouter = require('express').Router();
const { postImage, delImageById } = require('../controllers/image');
const { withErrorHandling, handle405Error } = require('../errors');

imageRouter.route('/').post(withErrorHandling(postImage)).all(handle405Error);

imageRouter
  .route('/:image_id')
  .delete(withErrorHandling(delImageById))
  .all(handle405Error);

module.exports = imageRouter;
