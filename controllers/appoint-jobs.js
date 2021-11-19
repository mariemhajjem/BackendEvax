const Agenda = require("agenda");
const moment = require('moment');

const Appoint = require("../models/appointment");
const Center = require("../models/center");
const AppointController = require('../appoint-controller');

const agenda = new Agenda({
    db: { address: "mongodb://localhost:27017/projet", collection: "appointsJobs" },
  });
  agenda.processEvery("3 days");
  agenda.define("sending emails job", async (job) => {
    const data = await SearchOldPeopleAppoints();
    await AddCenterToAppoint(data); 
});
  
const SearchOldPeopleAppoints = async () => {
    let appoints;
    try {
      appoints = await Appoint.find({pharmacy: null, center: null }).populate('user')
                .sort({'user.birthday': -1});
    } catch (error) {
      const err = new Error("Fetching appoints failed. please try again!");
      err.code = 500;
      return [];
    }
    return appoints
};

const AddCenterToAppoint = async (appoints) => {
  appoints.map((appoint)=> {
    const center = Center.findOne({city:appoint.user.city})
    const date = moment()
    .add(2,'d') // 2 : number of days to add
    .toDate();
    if(verifyDispo(center,date)){
      //update appoint (add date and center) 
      //send email
    }
  })
  return appoints
};
const verifyDispo = async (center,date) => {
  const appoints = await Appoint.find({pharmacy: null,center:center._id ,appointmentDate: date})
  return appoints.length < center.center_capacity * 8 * 2
};