const usersRouter = require('express').Router();

usersRouter.route('/').post().all();
usersRouter.route('/:username').get().all();

module.exports = usersRouter;