const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

// @desc    Send email
// @route   POST /api/email
// @access  Public
const sendEmail = asyncHandler(async (data, req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: process.env.SMTP_EMAIL, // generated ethereal user
    //     pass: process.env.SMTP_PASSWORD, // generated ethereal password
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },

    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SM_EMAIL, // generated ethereal user
      pass: process.env.SM_PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },

    // host: "smtp.mailtrap.io",
    // port: 2525,
    // auth: {
    //   user: "*******",
    //   pass: "********"
    // },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Hey 👻" <abc@gmail.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  //Message sent: <b7c6c8bb-71b2-4791-8d01-4b3d250da3b3@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  //Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

module.exports = sendEmail;
