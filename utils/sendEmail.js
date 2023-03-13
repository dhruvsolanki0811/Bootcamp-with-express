const nodemailer = require("nodemailer");

const sendEmail=async (options)=> {
//   let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}
module.exports = sendEmail;
