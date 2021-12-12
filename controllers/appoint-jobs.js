const moment = require("moment");

const Appoint = require("../models/appointment");
const Center = require("../models/center");
//const transporter = require("./email");
const creds = require("../config/contact");
const nodemailer = require("nodemailer");

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

const SendEmails = async () => {
  const data = await SearchOldPeopleAppoints();
  console.log("data from SendEmails : ", data);
  if (data) MapThroughAppoints(data);
};

const SearchOldPeopleAppoints = async () => {
  let appoints;
  try {
    appoints = await Appoint.find({ pharmacy: null, center: null })
      .populate("user")
      .sort({ "user.birthday": -1 });
  } catch (error) {
    const err = new Error("Fetching appoints failed. please try again!");
    err.code = 500;
    return [];
  }
  return appoints;
};

const MapThroughAppoints = (appoints) => {
  appoints.map(async (appoint) => {
    await modifyAppointAndSendEmail(appoint);
    console.log("done...");
  });
};
const modifyAppointAndSendEmail = async (appoint) => {
  //change with findAll centers
  //and verify dispo for each one and see if it finds a center or null!!
  console.log("one appoint :", appoint);
  if (!appoint) return;

  let center;
  try {
    center = await Center.findOne({ city: appoint.user.city });
  } catch (e) {
    console.log(e);
  }

  console.log("center from getCenter: ", center);
  const date = moment()
    .add(2, "d") // 2 : number of days to add
    .toDate();

  if (!center) return;

  if (verifyDispo(center, date)) {
    try {
      const ap = await Appoint.findByIdAndUpdate(
        { _id: appoint._id },
        { center: center._id, appointmentDate: date }
      );
      console.log(ap);
    } catch (e) {
      console.log(e);
    }

    //send email
    console.log("sending email rdv...");
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take messages");
      }
    });
    transporter.sendMail({
      to: appoint.user.email,
      from: "mariemhajjem10@gmail.com",
      subject: "Vaccination code",
      html: `
        <p>Hi ${appoint.user.firstname} ${appoint.user.lastname} !</p>
        <p>This is your vaccination code : ${appoint.user.code} </p>
        <p>This is your appointment date : ${date} in ${center.name}</p>
      `,
    });
    transporter.close();
  }
};

const verifyDispo = async (center, date) => {
  const appoints = await Appoint.find({
    pharmacy: null,
    center: center._id,
    appointmentDate: date,
  });
  console.log("appoints from verifyDispo : ", appoints);
  return appoints.length < center.center_capacity * 8 * 2;
};

exports.SendEmails = SendEmails;
