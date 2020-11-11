require('dotenv').config();
const { Welcome } = require("./welcome_template");

exports.getEmailData = (email, name, type, clientEmail) => {
  console.log("UTIL1", email, name, type, clientEmail)
  let data = null;

  switch (type) {
    case "Welcome":
      data = {
        from: `CharityBay <${process.env.AUTH_USER}>`,
        to: email,
        subject: `Hello ${name}`,
        html: "Welcome to CharityBay your one stop shop to buy and sell whilst donating to charity.  Thanks for all your support from everyone at CharityBay!"
      }
      break;

    case "Bought":
      data = {
        from: `CharityBay <${process.env.AUTH_USER}>`,
        to: email,
        subject: "You've made a PURCHASE on CharityBay",
        html: `Thank you ${name} for your purchase, please contact ${clientEmail} to arrange delivery.`
      }
      break;

      case "Sold":
      data = {
        from: `CharityBay <${process.env.AUTH_USER}>`,
        to: email,
        subject: "Great News, your item on CharityBay has SOLD!",
        html: `Guess what ${name}, your item has been sold to ${clientEmail}.  They will be in touch soon to arrange deliver.`
      }
      break;

    default: data;

  }
  return data;
}