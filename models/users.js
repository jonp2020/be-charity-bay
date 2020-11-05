const connection = require('../db/connection');

exports.insertUser = async (body) => {
  const [user] = await connection('users').insert(body, '*');
  return user;
};
exports.selectUserByUsername = async (username) => {
  const user = await connection('users')
    .select('*')
    .first()
    .where({ username });
  if (!user) {
    return Promise.reject({ status: 404, msg: 'User Not Found' });
  }
  return user;
};
