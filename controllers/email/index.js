const creds = require("../../config/contact");
const nodemailer = require("nodemailer");

// const creds = require("../../config/creds");

var transport = {
  service: "gmail",
  secure: false,
  port: 25,
  auth: {
    user: creds.USER,
    pass: creds.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

var transporter = nodemailer.createTransport(transport);

exports.transporter = transporter;
