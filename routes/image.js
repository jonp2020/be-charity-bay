const imageRouter = require('express').Router();

imageRouter.route('/').post().all();
imageRouter.route('/:image_id').delete().all();


module.exports = imageRouter