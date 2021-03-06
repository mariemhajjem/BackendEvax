// const creds = require("../config/contact");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const Center = require("../models/center");
const { addAppoint } = require("./appoint-controller");
const creds = require("../config/contact");

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
const generateCode = () => {
  const characters = "01234567890";

  let code = "";
  for (let i = 0; i < 9; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const login = async (req, res, next) => {
  const { cin, code } = req.body;

  let user;
  try {
    user = await User.findOne({ cin: cin, code: code });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not login!");
    err.code = 500;
    return next(err);
  }

  if (!user) {
    const err = new Error(
      "Identifiants fournis non valides, impossible de se connecter."
    );
    err.code = 404;
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, cin: user.cin, role: user.role },
      "center_code",
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new Error("logging user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.json({ token: token, user: user });
};

const registerCenter = async (req, res, next) => {
  const { cin, firstname, lastname, email, governorate, city, birthday } =
    req.body;

  let addedUser;
  try {
    addedUser = await User.findOne({ cin: cin, email: email });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not add user!");
    err.code = 500;
    return next(err);
  }
  if (addedUser) {
    const err = new Error("Identifiants fournis deja utilisés.");
    err.code = 400;
    return next(err);
  }

  const code = generateCode();
  const createUser = new User({
    cin,
    firstname,
    lastname,
    email,
    governorate,
    city,
    birthday,
    code,
  });
  console.log(createUser);
  try {
    await createUser.save();
  } catch (errs) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  req.body.userId = createUser.id;

  addAppoint(req, res, next);
  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, cin: createUser.cin },
      "center_code",
      { expiresIn: "1d" }
    );
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take messages");
      }
    });
    transporter.sendMail({
      to: req.body.email,
      from: "evax.isamm@gmail.com",
      subject: "Vaccination code",
      html: `
        <p>Hi ${firstname} ${lastname} !</p>
        <p>This is your vaccination code : ${code} </p>
      `,
    });
    transporter.close();
  } catch (err) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ user: createUser, cin: createUser.cin, token: token });
};

const registerPharmacy = async (req, res, next) => {
  const {
    cin,
    firstname,
    lastname,
    email,
    pharmacy,
    appointmentDate,
    appointmentTime,
  } = req.body;
  let addedUser;
  try {
    addedUser = await User.findOne({ cin: cin });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not add user!");
    err.code = 500;
    return next(err);
  }
  if (!addedUser) {
    const err = new Error("User doesn't exist, register first");
    err.code = 400;
    return next(err);
  }

  const createUser = new User({
    cin,
    firstname,
    lastname,
    email,
  });

  try {
    await createUser.save();
  } catch (errs) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }
  req.body.userId = createUser.id;
  req.body.pharmacy = pharmacy;
  req.body.appointmentDate = appointmentDate;
  req.body.appointmentTime = appointmentTime;
  addAppoint(req, res, next);
  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, cin: createUser.cin },
      "pharmacy_code",
      { expiresIn: "1d" }
    );

    const code = generateCode();
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take messages");
      }
    });
    transporter.sendMail({
      to: req.body.email,
      from: "evax.isamm@gmail.com",
      subject: "Vaccination code",
      html: `
        <p>Hi ${firstname} ${lastname} !</p>
        <p>This is your vaccination code : ${code} </p>
      `,
    });
    transporter.close();
  } catch (err) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createUser.id, cin: createUser.cin, token: token });
};

exports.login = login;
exports.registerCenter = registerCenter;
exports.registerPharmacy = registerPharmacy;
