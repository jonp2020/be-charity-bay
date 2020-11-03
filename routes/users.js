const usersRouter = require('express').Router();

usersRouter.route('/').post().all();
usersRouter.route('/:user_id').get().all();

module.exports = usersRouter