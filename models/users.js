const connection = require("../db/connection");

exports.insertUser = async (body) => {
  const [user] = await connection("users").insert(body, "*");
  return user;
};
exports.selectUserByUsername = (username) => {};
