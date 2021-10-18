const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const Center = require("../models/center");
//const creds = require('../config/contact');
const creds = require('../config/creds');
const {addAppoint} = require('./appoint-controller')
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

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

const generateCode = () => {
  const characters = "01234567890";

  let code = "";
  for (let i = 0; i < 9; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const login = async (req, res, next) => {
  const {
    cin, 
    password, 
     } = req.body;
     console.log(req.body)
  let user;
  try {
    user = await User.findOne({ cin: cin });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not login!");
    err.code = 500;
    return next(err);
  }

  if (!user) {
    const err = new Error("Invalid credentials provided, could not login.");
    err.code = 404;
    return next(err);
  }

  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, user.password);
  } catch (error) {
    const err = new Error(
      "could not login user, please check your credentiels."
    );
    err.code = 500;
    return next(err);
  }

  if (!isValidPass) {
    const err = new Error("Invalid credentials provided, could not login.");
    err.code = 401;
    return next(err);
  }

  let token;
  try {
    token = jwt.sign({ userId: user.id, cin: user.cin }, "center_code", {
      expiresIn: "1d",
    });
  } catch (err) {
    const error = new Error("logging user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.json({ user: user, cin: user.cin, token: token });
};

const register = async (req, res, next) => {
  const { cin, password, firstname, lastname, email, center } = req.body;
  let addedUser;
  try {
    addedUser = await User.findOne({ cin: cin });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not add user!");
    err.code = 500;
    return next(err);
  }
  if (addedUser) {
    const err = new Error("User already exists, please login instead.");
    err.code = 400;
    return next(err);
  }

  let hashPass;
  try {
    hashPass = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new Error("Could not create User. please try again.");
    err.code = 500;
    return next(err);
  }

  const createUser = new User({
    cin,
    password: hashPass,
    firstname,
    lastname,
    email,
    center,
  });

  try {
    await createUser.save();
  } catch (errs) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }
  req.body.userId = createUser.id;
  req.body.center = center;
  /* req.body.appointmentDate = appointmentDate
  req.body.appointmentTime = appointmentTime */
  addAppoint(req, res, next);
  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, cin: createUser.cin },
      "center_code",
      { expiresIn: "1d" }
    );
    code = generateCode();
    transporter.sendMail({
      to: req.body.email,
      from: "mariemhajjem10@gmail.com",
      subject: "Vaccination code",
      html: `
        <p>Hi ${firstname} ${lastname} !</p>
        <p>This is your vaccination code : ${code} </p>
      `,
    });
  } catch (err) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res
    .status(201)
    .json({ user: createUser, cin: createUser.cin, token: token });
};

exports.login = login;
exports.register = register;
