require('dotenv').config();
const { getEmailData } = require('../utils/utils');
const mailer = require('nodemailer');

exports.sendMail = (email, name, type, clientEmail) => {
  console.log("MODEL 1", email, name, type, clientEmail);
  const smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS
    },
  });

  const mail = getEmailData(email, name, type, clientEmail);

  smtpTransport.sendMail(mail, function (error, response) {
     if (error) {
      console.log(error)
    } else {
      console.log("email sent successfully")
    }
    smtpTransport.close();
    console.log("MODEL 3", response);
    return response;
  });
};
