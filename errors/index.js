exports.withErrorHandling = controller => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

exports.send500Error = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({msg: 'Internal server error'});
}
