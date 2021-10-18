const mongoose = require("mongoose");

const Vaccine = require("../models/vaccine");

const getVaccines = async (req, res, next) => {
  let vaccines;
  try {
    vaccines = await Vaccine.find();
  } catch (error) {
    const err = new Error("Fetching vaccines failed. please try again!");
    err.code = 500;
    return next(err);
  }
  res.json({
    vaccines: vaccines.map((vaccine) => vaccine.toObject({ getters: true })),
  });
};

const addVaccine = async (req, res, next) => {
  const { vaccine_type, stock } = req.body;

  let existingVaccine;
  try {
    existingVaccine = await Vaccine.findOne({ vaccine_type: vaccine_type });
  } catch (error) {
    const err = new Error("Somthing went wrong. Please try again");
    err.code = 500;
    return next(err);
  }

  if (existingVaccine) {
    const err = new Error("Vaccine already exist, please check Vaccines List.");
    err.code = 500;
    return next(err);
  }

  const createdVaccine = new Vaccine({
    vaccine_type,
    stock,
  });

  try {
    await createdVaccine.save();
  } catch (err) {
    const error = new Error("Creating vaccine failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ newVaccine: createdVaccine });
};

const updateVaccine = async (req, res, next) => {
  const { stock } = req.body;
  const idVacc = req.params.id;

  let updatedVaccine;
  try {
    updatedVaccine = await Vaccine.findOne({ _id: idVacc });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not update vaccine!");
    err.code = 500;
    return next(err);
  }

  updatedVaccine.stock = stock;

  try {
    await updatedVaccine.save({}, async (err, vacc) => {
      if (err) throw err;
    });
  } catch (err) {
    const error = new Error("Updating vaccine failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res
    .status(200)
    .json({ updatedVaccine: updatedVaccine.toObject({ getters: true }) });
};

const deleteVaccine = async (req, res, next) => {
  const idVacc = req.params.id;

  let vaccine;
  try {
    vaccine = await Vaccine.findById(idVacc);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not delete vaccine!");
    err.code = 500;
    return next(err);
  }

  if (!vaccine) {
    const err = new Error("Delete failed, could not find Vaccine!");
    err.code = 500;
    return next(err);
  }

  try {
    await vaccine.remove({}, (err, vacc) => {
      if (err) console.log(err);
      else console.log("deleted");
    });
  } catch (err) {
    const error = new Error("Deleting vaccine failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ vaccine: vaccine.toObject({ getters: true }) });
};

const getVaccineById = async (req, res, next) => {
  const idVacc = req.params.id;
  console.log(idVacc);
  let vaccine;
  try {
    vaccine = await Vaccine.findById(idVacc);
  } catch (error) {
    const err = new Error(
      "Something went wrong. could not find vaccine with this name!"
    );
    err.code = 500;
    return next(err);
  }

  if (!vaccine) {
    const err = new Error("No vaccine found with the provided vaccine name!");
    err.code = 404;
    return next(err);
  }

  res.json({ vaccine: vaccine.toObject({ getters: true }) });
};

exports.getVaccines = getVaccines;
exports.addVaccine = addVaccine;
exports.updateVaccine = updateVaccine;
exports.deleteVaccine = deleteVaccine;
exports.getVaccineById = getVaccineById;
