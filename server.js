const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { send500Error } = require('./errors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/products/:id', function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app.use('/api', apiRouter);

app.use(send500Error);

module.exports = app;
