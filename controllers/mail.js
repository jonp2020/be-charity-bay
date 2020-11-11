const { sendMail } = require("../models/mail");

exports.postMail = async (req, res) => {
  // console.log("controller", req);
  const {body: { email, name, type, clientEmail }} = req;
  sendMail(email, name, type, clientEmail, (result) => {
        res.status(201).send({ result });
  }); 
}
