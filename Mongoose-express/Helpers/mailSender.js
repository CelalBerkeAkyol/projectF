const nodemailer = require("nodemailer");
const sendEmail = async (mailOptions) => {
  const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
  let transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
