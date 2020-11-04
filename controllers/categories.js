const { selectCategories } = require('../models/categories');

exports.getCategories = async (req, res) => {
  const categories = await selectCategories();
  res.send({ categories });
};
