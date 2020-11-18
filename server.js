const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const {
  invalidEndpointHandler,
  send500Error,
  customErrorHandler,
  PSQLErrorHandler,
  handle405Error,
} = require('./errors');
const listEndpoints = require('express-list-endpoints');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/products/:id', function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app
  .route('/api')
  .get((req, res, next) => {
    res.send({ endpoints: listEndpoints(app) });
  })
  .all(handle405Error);
app.use('/api', apiRouter);
app.use('/*', invalidEndpointHandler);

app.use(customErrorHandler);
app.use(PSQLErrorHandler);
app.use(send500Error);

module.exports = app;
