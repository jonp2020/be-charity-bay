const usersRouter = require('express').Router();
const { postUser, getUserByUsername } = require('../controllers/users');
const { handle405Error, withErrorHandling } = require('../errors');

usersRouter.route('/').post(withErrorHandling(postUser)).all(handle405Error);

usersRouter
  .route('/:username')
  .get(withErrorHandling(getUserByUsername))
  .all(handle405Error);

module.exports = usersRouter;
