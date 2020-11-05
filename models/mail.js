require('dotenv').config();
const getEmailData = require('../utils/utils');
const mailer = require('nodemailer');

exports.sendMail = (to, name, type) => {
  const smtpTransport = mailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  const mail = getEmailData(to, name, type);

  smtpTransport.sendMail(mail, function (error, response) {
    console.log(response);
    smtpTransport.close();
    return response;
  });
};
