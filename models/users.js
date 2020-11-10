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
    return [];
  }
  return user;
};

exports.selectUserByEmail = async (email) => {
  const user = await connection('users').select('*').first().where({ email });
  if (!user) {
    return [];
  }
  return user;
};
