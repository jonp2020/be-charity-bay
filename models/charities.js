const connection = require('../db/connection');

exports.selectCharities = () => {
  return connection('charities').select('*');
};
