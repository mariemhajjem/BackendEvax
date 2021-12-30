const mongoose = require("mongoose");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    const err = new Error("Fetching users failed. please try again!");
    err.code = 500;
    return next(err);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const getUserByCin = async (req, res, next) => {
  const userCin = req.params.cin;

  let user;
  try {
    user = await User.findOne({ cin: userCin });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not find user!");
    err.code = 500;
    return next(err);
  }

  if (!user) {
    const err = new Error("No user found with the provided CIN!");
    err.code = 404;
    return next(err);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const addUser = async (req, res, next) => {
  const { firstname, lastname, cin, email, birthday, role,governorate,city } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ cin: cin });
  } catch (error) {
    const err = new Error("Somthing went wrong. Please try again");
    err.code = 500;
    return next(err);
  }

  if (existingUser) {
    const err = new Error("User already exist, please check Users List.");
    err.code = 500;
    return next(err);
  }

  const createdUser = new User({
    firstname,
    lastname,
    cin,
    email,
    birthday,
    governorate,
    city,
    role
  });

  try {
    await createdUser.save({}, async (err, clt) => {
      if (err) throw err;
    });
  } catch (err) {
    const error = new Error("Creating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ newUser: createdUser });
};

const updateUser = async (req, res, next) => {
  const { firstname, lastname, cin, email, address, birthday } = req.body;
  const userCin = req.params.cin;

  let updatedUser;
  try {
    updatedUser = await User.findOne({ _id: userCin });
  } catch (error) {
    const err = new Error("Somthing went wrong. could not update user!");
    err.code = 500;
    return next(err);
  }

  updatedUser.firstname = firstname;
  updatedUser.lastname = lastname;
  updatedUser.cin = cin;
  updatedUser.email = email;
  updatedUser.birthday = birthday;
  updatedUser.address = address;

  try {
    await updatedUser.save({}, async (err, clt) => {
      if (err) throw err;
    });
  } catch (err) {
    const error = new Error("Updating user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res
    .status(200)
    .json({ updatedUser: updatedUser.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not delete user!");
    err.code = 500;
    return next(err);
  }

  if (!user) {
    const err = new Error("Delete failed, could not find User!");
    err.code = 500;
    return next(err);
  }

  try {
    await user.remove({}, (err, clt) => {
      if (err) console.log(err);
      else console.log("deleted");
    });
  } catch (err) {
    const error = new Error("Deleting user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.addUser = addUser;
exports.getUserByCin = getUserByCin;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
