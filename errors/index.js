exports.withErrorHandling = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res);
    } catch (err) {
      next(err);
    }
  };
};

exports.invalidEndpointHandler = (req, res, next) => {
  res.status(404).send({ msg: 'This page does not exist' });
};

exports.handle405Error = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.PSQLErrorHandler = (err, req, res, next) => {
  const errorCodes = ['23502', '42703', '22P02'];
  const notFound = ['23503'];
  const alreadyExists = ['23505'];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (notFound.includes(err.code)) {
    res.status(404).send({ msg: 'Not Found' });
  } else if (alreadyExists.includes(err.code)) {
    res.status(400).send({ msg: 'Username already exists' });
  } else {
    next(err);
  }
};

exports.send500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal server error' });
};
