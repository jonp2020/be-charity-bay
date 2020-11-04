exports.getEmailData = (to, name, template) => {
  let data = null;

  switch (template) {
    case "hello":
      data = {
        from: "CharityBay <pitzfootball@gmail.com>",
        to,
        subject: `Hello ${name}`,
        html: "Hello"
      }
      break;

    case "thanks":
      data = {
        from: "CharityBay <pitzfootball@gmail.com",
        to,
        subject: `Thanks ${name}`,
        html: "Thanks"
      }
      break;
    default: data;

  }
  return data;
}