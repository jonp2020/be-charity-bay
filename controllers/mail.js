const { sendMail } = require("../models/mail");

exports.postMail = async (req, res) => {
  const {body: { email, name, type }} = req;
  const response = await sendMail(email, name, type);
}