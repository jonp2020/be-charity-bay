const apiRouter = require('express').Router();
const categoriesRouter = require('./categories')
const charitiesRouter = require('./charities')
const usersRouter = require('./users')
const itemsRouter = require('./items')
const mailRouter = require('./mail')
const imageRouter = require('./image')




apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/charities', charitiesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/items', itemsRouter);

apiRouter.use('/mail', mailRouter);

apiRouter.use('/image', imageRouter);


module.exports = apiRouter;
