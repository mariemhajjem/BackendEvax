const Center = require("../models/center");
const Vaccine = require("../models/vaccine");

const getCenters = async (req, res, next) => {
  let centers;
  try {
    centers = await Center.find();
  } catch (error) {
    const err = new Error("Fetching centers failed. please try again!");
    err.code = 500;
    return next(err);
  }
  res.json({
    centers: centers.map((center) => center.toObject({ getters: true })),
  });
};
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
  const { name, governorate, city, center_capacity, number_vaccine } = req.body;
  const createdCenter = new Center({
    name,
    governorate,
    city,
    center_capacity,
    number_vaccine,
  });

  try {
    await createdCenter.save();
  } catch (errs) {
    const error = new Error("Creating center failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ newCenter: createdCenter });
};
const updateCenter = async (req, res, next) => {
  const { id, name, governorate, city, center_capacity, number_vaccine } =
    req.body;

  let upcenter;
  try {
    upcenter = await Center.findById(id);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not update center!");
    err.code = 500;
    return next(err);
  }
  if (!upcenter) {
    const err = new Error("No center found with the provided id!");
    err.code = 404;
    return next(err);
  }
  (upcenter.name = name),
    (upcenter.governorate = governorate),
    (upcenter.city = city),
    (upcenter.center_capacity = center_capacity),
    (upcenter.number_vaccine = number_vaccine);

  try {
    await upcenter.save();
  } catch (err) {
    const error = new Error("Updating center failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ updatedCenter: upcenter.toObject({ getters: true }) });
};

const deposit = async (req, res, next) => {
  const { amount,idVacc } = req.body;
  const name = req.params.name;
  let vaccine;
  let center;
  try {
    center = await Center.findOne({ name: name });
    vaccine = await Vaccine.findById(idVacc);
  } catch (error) {
    const err = new Error(
      "Somthing went wrong. could not make deposit's operation!"
    );
    err.code = 500;
    return next(err);
  }

  if (!center) {
    const err = new Error("No center found with the provided Center name!");
    err.code = 500;
    return next(err);
  } 
  if(center.type_vaccine){
    const err = new Error("Another vaccine already exists!");
    err.code = 500;
    return next(err);
  }
  if (!vaccine) {
    const err = new Error("No vaccine found with the provided id!");
    err.code = 500;
    return next(err);
  }
  
  vaccine.stock -= Number(amount);
  center.number_vaccine += Number(amount);
  center.type_vaccine= vaccine.type_vaccine
  try {
    await center.save();
  } catch (err) {
    const error = new Error("Deposit failed. Please try again!");
    error.code = 500;
    return next(error);
  }
  try {
    await vaccine.save();
  } catch (err) {
    const error = new Error("Deposit failed. Please try again!");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({ center: center.toObject({ getters: true }) });
};

const withdraw = async (req, res, next) => {
  const { amount } = req.body;
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
    const err = new Error("No center found with the provided Center Number!");
    err.code = 500;
    return next(err);
  }

  if (center.number_vaccine > amount) {
    center.number_vaccine -= Number(amount);

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
  const name = req.params.name;
  let center;
  try {
    center = await Center.findOne({ name: name });
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
    await center.remove({}, (err, clt) => {
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
exports.updateCenter = updateCenter;
exports.deleteCenter = deleteCenter;
exports.getCenters = getCenters;
