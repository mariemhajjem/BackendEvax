const Pharmacy = require("../models/pharmacy"); 
const { request } = require("../routes/vaccines-routes");

const getPharmacies = async (req, res, next) => {
  let pharmacies;
  try {
    pharmacies = await Pharmacy.find();
  } catch (error) {
    const err = new Error("Fetching pharmacies failed. please try again!");
    err.code = 500;
    return next(err);
  }
  res.json({
    pharmacies: pharmacies.map((pharmacy) => pharmacy.toObject({ getters: true })),
  });
};
const getPharmacyById = async (req, res, next) => {
  const pharmacyId = req.params.pharmacyId;

  let pharmacy;
  try {
    pharmacy = await Pharmacy.findById(pharmacyId);
  } catch (error) {
    const err = new Error(
      "Somthing went wrong. could not find pharmacy with id!"
    );
    err.code = 500;
    return next(err);
  }

  if (!pharmacy) {
    const err = new Error("No pharmacy found with the provided ID!");
    err.code = 404;
    return next(err);
  }

  res.json({ pharmacy: pharmacy.toObject({ getters: true }) });
};

const getPharmacyByName = async (req, res, next) => {
  const NumPharmacy = req.params.name;

  let pharmacy;
  try {
    pharmacy = await Pharmacy.findOne({ name: NumPharmacy });
  } catch (error) {
    const err = new Error(
      "Something went wrong. could not find pharmacy with number!"
    );
    err.code = 500;
    return next(err);
  }

  if (!pharmacy) {
    const err = new Error("No pharmacy found with the provided Pharmacy Number!");
    err.code = 404;
    return next(err);
  }

  res.json({ pharmacy: pharmacy.toObject({ getters: true }) });
};
 
const addPharmacy = async (req, res, next) => {
  const { name,governorate, city,pharmacy_capacity,number_vaccine} = req.body;
  const createdPharmacy = new Pharmacy({
    name, 
    governorate, 
    city,
    pharmacy_capacity,
   number_vaccine
  });

  try {
    await createdPharmacy.save({}, (err, pharmacy) => {
      if (err) throw err;
    }); 
   
  } catch (errs) {
    const error = new Error("Creating pharmacy failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ newPharmacy: createdPharmacy });
};

const deposit = async (req, res, next) => {
  const { amount } = req.body;
  const name = req.params.name;

  let pharmacy;
  try {
    pharmacy = await Pharmacy.findOne({ name: name });
  } catch (error) {
    const err = new Error(
      "Somthing went wrong. could not make deposit's operation!"
    );
    err.code = 500;
    return next(err);
  }

  if (!pharmacy) {
    const err = new Error(
      "No pharmacy found with the provided Pharmacy Number!"
    );
    err.code = 500;
    return next(err);
  }

  pharmacy.number_vaccine += Number(amount);

  try {
    await pharmacy.save();
  } catch (err) {
    const error = new Error("Deposit failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ pharmacy: pharmacy.toObject({ getters: true }) });
};

const withdraw = async (req, res, next) => {
  const { amount} = req.body;
  const name = req.params.name;

  let pharmacy;
  try {
    pharmacy = await Pharmacy.findOne({ name: name });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not make operation!");
    err.code = 500;
    return next(err);
  }

  if (!pharmacy) {
    const err = new Error(
      "No pharmacy found with the provided Pharmacy Number!"
    );
    err.code = 500;
    return next(err);
  }

  if (pharmacy.number_vaccine > amount) {
    pharmacy.number_vaccine -= Number(amount);
 
    try {
      await pharmacy.save();
    } catch (err) {
      const error = new Error("Operation failed. Please try again!");
      error.code = 500;
      return next(error);
    } 

    res.status(200).json({ pharmacy: pharmacy.toObject({ getters: true }) });
  } else {
    const error = new Error("insufficient balance. reload your pharmacy!");
    error.code = 500;
    return next(error);
  }
};

const deletePharmacy = async (req, res, next) => {
  const pharmacyId = req.params.idpharmacy; 
  let pharmacy;
  try {
    pharmacy = await Pharmacy.findById(pharmacyId);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not delete pharmacy!");
    err.code = 500;
    return next(err);
  }

  if (!pharmacy) {
    const err = new Error("Delete failed, could not find Pharmacy!");
    err.code = 500;
    return next(err);
  }

  try { 
    await pharmacy.remove({ }, (err, clt) => {
      if (err) console.log(err);
      else console.log("deleted");
    }); 
  } catch (err) {
    const error = new Error("Deleting pharmacy failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ pharmacy: pharmacy.toObject({ getters: true }) });
};
 
exports.withdraw        = withdraw;
exports.deposit         = deposit;
exports.getPharmacyByName = getPharmacyByName;
exports.addPharmacy       = addPharmacy;
exports.getPharmacyById   = getPharmacyById;
exports.deletePharmacy    = deletePharmacy; 
exports.getPharmacies      = getPharmacies;
