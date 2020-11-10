const {
  insertUser,
  selectUserByUsername,
  selectUserByEmail,
} = require('../models/users');

exports.postUser = async (req, res) => {
  const { body } = req;
  const user = await insertUser(body);
  res.status(201).send({ user });
};

exports.getUserByUsername = async (req, res) => {
  const {
    params: { username },
  } = req;
  const user = await selectUserByUsername(username);
  res.send({ user });
};

exports.getUserByEmail = async (req, res) => {
  const {
    params: { email },
  } = req;
  const user = await selectUserByEmail(email);
  res.send({ user });
};
