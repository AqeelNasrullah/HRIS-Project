//importing dependencies
const nodeMailer = require("nodemailer");

//importing middlewares
const asyncErrorHandler = require("./errors/asyncErrorHandler");

const sendEmail = asyncErrorHandler(async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: false,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
