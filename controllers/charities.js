const { selectCharities } = require('../models/charities');

exports.getCharities = async (req, res) => {
  const charities = await selectCharities();
  res.send({ charities });
};
