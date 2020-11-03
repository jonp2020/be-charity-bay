const connection = require('../db/connection')

exports.selectCategories = () => {
  return connection('categories').select('*');
}