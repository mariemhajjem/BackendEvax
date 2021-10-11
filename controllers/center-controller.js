const Center = require("../models/center"); 

const getCenterById = async (req, res, next) => {
  const centerId = req.params.centerId;

  let center;
  try {
    center = await Center.findById(centerId);
  } catch (error) {
    const err = new Error(
      "Somthing went wrong. could not find center with id!"
    );
    err.code = 500;
    return next(err);
  }

  if (!center) {
    const err = new Error("No center found with the provided ID!");
    err.code = 404;
    return next(err);
  }

  res.json({ center: center.toObject({ getters: true }) });
};

const getCenterByName = async (req, res, next) => {
  const NumCenter = req.params.name;

  let center;
  try {
    center = await Center.findOne({ name: NumCenter });
  } catch (error) {
    const err = new Error(
      "Something went wrong. could not find center with number!"
    );
    err.code = 500;
    return next(err);
  }

  if (!center) {
    const err = new Error("No center found with the provided Center Number!");
    err.code = 404;
    return next(err);
  }

  res.json({ center: center.toObject({ getters: true }) });
};
 
const addCenter = async (req, res, next) => {
  const { name, typeofcenter,capacity } = req.body;
  const createdCenter = new Center({
    name, 
    typeofcenter,
    capacity
  });

  try {
    await createdCenter.save({}, (err, center) => {
      if (err) throw err;
    }); 
   
  } catch (errs) {
    const error = new Error("Creating center failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ newCenter: createdCenter });
};

const deposit = async (req, res, next) => {
  const { amount } = req.body;
  const name = req.params.name;

  let center;
  try {
    center = await Center.findOne({ name: name });
  } catch (error) {
    const err = new Error(
      "Somthing went wrong. could not make deposit's operation!"
    );
    err.code = 500;
    return next(err);
  }

  if (!center) {
    const err = new Error(
      "No center found with the provided Center Number!"
    );
    err.code = 500;
    return next(err);
  }

  center.overallAmount += Number(amount);

  try {
    await center.save();
  } catch (err) {
    const error = new Error("Deposit failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ center: center.toObject({ getters: true }) });
};

const withdraw = async (req, res, next) => {
  const { amount} = req.body;
  const name = req.params.name;

  let center;
  try {
    center = await Center.findOne({ name: name });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not make operation!");
    err.code = 500;
    return next(err);
  }

  if (!center) {
    const err = new Error(
      "No center found with the provided Center Number!"
    );
    err.code = 500;
    return next(err);
  }

  if (center.overallAmount > amount) {
    center.overallAmount -= Number(amount);
 
    try {
      await center.save();
    } catch (err) {
      const error = new Error("Operation failed. Please try again!");
      error.code = 500;
      return next(error);
    } 

    res.status(200).json({ center: center.toObject({ getters: true }) });
  } else {
    const error = new Error("insufficient balance. reload your center!");
    error.code = 500;
    return next(error);
  }
};

const deleteCenter = async (req, res, next) => {
  const centerId = req.params.idcenter;
  console.log(req.params.idcenter)
  let center;
  try {
    center = await Center.findById(centerId);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not delete center!");
    err.code = 500;
    return next(err);
  }

  if (!center) {
    const err = new Error("Delete failed, could not find Center!");
    err.code = 500;
    return next(err);
  }

  try { 
    await center.remove({ }, (err, clt) => {
      if (err) console.log(err);
      else console.log("deleted");
    }); 
  } catch (err) {
    const error = new Error("Deleting center failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ center: center.toObject({ getters: true }) });
};
 
exports.withdraw = withdraw;
exports.deposit = deposit;
exports.getCenterByName = getCenterByName;
exports.addCenter = addCenter;
exports.getCenterById = getCenterById;
exports.deleteCenter = deleteCenter; 
