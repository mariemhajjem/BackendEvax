const User = require("../models/user");
const Appoint = require("../models/appointment");

const SearchOldPeopleAppoints = async (req, res, next) => {
  let appoints;
  try {
    appoints = await Appoint.find({pharmacy: null, center: null })
              .populate('center').populate('user') 
              .sort({'user.birthday': -1});
  } catch (error) {
    const err = new Error("Fetching appoints failed. please try again!");
    err.code = 500;
    return next(err);
  }
  res.json(appoints) 
};
const addAppoint = async (req, res, next) => {
    const { appointmentDate, appointmentTime,center,pharmacy, userId} = req.body 
    const appoint = new Appoint({
        appointmentDate ,
        appointmentTime ,
        center ,
        pharmacy,
        user : userId
    })
    console.log(appoint)
    try {
        await appoint.save();
    } catch (errs) {
        const error = new Error("Creating appointement failed. Please try again!");
        error.code = 500;
        return next(error);
    }
    res.status(201).json({ appoint });
}

const addAppointDate = async (req, res, next) => {
    
  try { 
    Appoint.findByIdAndUpdate({_id : req.params.id }, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not update apointement!");
    err.code = 500;
    return next(err);
  }
  
}

const updateAppoint = async (req, res, next) => {
    
  try { 
    Appoint.findByIdAndUpdate({_id : req.params.id }, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not update apointement!");
    err.code = 500;
    return next(err);
  }
  
} 
exports.SearchOldPeopleAppoints = SearchOldPeopleAppoints
exports.addAppoint = addAppoint
exports.updateAppoint = updateAppoint
exports.addAppointDate = addAppointDate