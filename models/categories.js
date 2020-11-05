const connection = require('../db/connection');

exports.selectCategories = async () => {
  return connection('categories').select('*');
};
