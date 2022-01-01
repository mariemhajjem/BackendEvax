const openDay = require("../models/openDay");
const Center = require("../models/center");
const Users = require("../models/user")
const { request } = require("../routes/openDay-routes");


const getOpendays = async (req, res, next) => {
  let Opendays;
  try {
    Opendays = await openDay.find();
  } catch (error) {
    const err = new Error("Fetching open days failed. please try again!");
    err.code = 500;
    return next(err);
  }
  res.json({
    openDays: Opendays.map((od) =>
      od.toObject({ getters: true })
    ),
  });
};

const getOpendaysById = async (req, res, next) => {
  const OpendayId = req.params.pharmacyId;

  let openday;
  try {
    openday = await Pharmacy.findById(OpendayId);
  } catch (error) {
    const err = new Error(
      "Somthing went wrong. could not find openday with id!"
    );
    err.code = 500;
    return next(err);
  }

  if (!openday) {
    const err = new Error("No openday found with the provided ID!");
    err.code = 404;
    return next(err);
  }

  res.json({ openDay: openday.toObject({ getters: true }) });
};


const addOpenDay = async (req, res, next) => {
  const { date, appointmentTime, center,startAge,endAge,vaccine_type  } =
    req.body;


    //centre ocuppée 
    let existingCenter;
    try {
        existingCenter = await openDay.findOne({ center: center });
    } catch (error) {
      const err = new Error("Somthing went wrong. Please try again");
      err.code = 500;
      return next(err);
    }




    if (existingCenter && !existingCenter.status) {
        const err = new Error("center already occupue, please check opendays List.");
        err.code = 500;
        return next(err);
      }

      //finding users  (between startAge , endAge)
      var d = new Date();
      let year=d.getFullYear();
      let usersList
      let Volunteers
      let selectedCenter
      try {
        usersList = await Users.find({ birthday: {
            $gt: new Date(year -endAge + "-01-01T00:00:00.000Z"),
            $lt: new Date(year-startAge+"-12-12T00:00:00.000Z")
        }, role: {$eq :'enrolled' }});

        selectedCenter = await Center.findById(center)


    } catch (error) {
      const err = new Error("Somthing went wrong. Please try again");
      err.code = 500;
      return next(err);
    }
    console.log('****************',usersList)

// find volunteers in same city Or governate where role $eq= volunteer  --> inviting
    try {
        Volunteers = await Users.find({role: {$eq :'volunteer' } 
        ,$or:[{city:selectedCenter.city},{governorate:selectedCenter.governorate}]});

    } catch (error) {
      const err = new Error("Somthing went wrong. Please try again");
      err.code = 500;
      return next(err);
    }
   
    //  let status = false
  const createdopenDay = new openDay({
    date, appointmentTime, center, volunteersList: Volunteers, users:usersList,number_vacinne:0,startAge,endAge, status:false   ,vaccine_type
  });

  try {
    await createdopenDay.save({}, (err, openday) => {
      if (err) throw err;
    });
  } catch (errs) {
    const error = new Error("Creating open day failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ newOpenDay: createdopenDay });
};



const updateOpenDay = async (req, res, next) => {
    const { date, appointmentTime, center, volunteersList, users } =
    req.body;

  let upopenday;
  try {
    upopenday = await openDay.findById(id);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not update open day!");
    err.code = 500;
    return next(err);
  }
  if (!upopenday) {
    const err = new Error("No open day found with the provided id!");
    err.code = 404;
    return next(err);
  }
  (upopenday.date = date),
    (upopenday.appointmentTime = appointmentTime),
    (upopenday.center = center),
    (upopenday.volunteersList = volunteersList),
    (upopenday.users = users );

  try {
    await upopenday.save();
  } catch (err) {
    const error = new Error("Updating open day failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res
    .status(200)
    .json({ updatedOpenDay: upopenday.toObject({ getters: true }) });
};



exports.getOpendays = getOpendays;
exports.getOpendaysById = getOpendaysById;
exports.addOpenDay = addOpenDay;
exports.updateOpenDay = updateOpenDay;

