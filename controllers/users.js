const { insertUser, selectUserByUsername } = require("../models/users");

exports.postUser = async (req, res) => {
  const { body } = req;
  const postedUser = await insertUser(body);
}

exports.getUserByUsername = async (req, res) => {
  const { params: { username } } = req;
  const user = await selectUserByUsername(username);
}