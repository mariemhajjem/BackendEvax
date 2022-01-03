const mongoose = require("mongoose");

const User = require("../models/user");
const { roles } = require('./roles');



const grantAccess = (action, resource) => {
  console.log(action,resource)
  return async (req, res, next) => {
   try {
     //a modifier 
    const permission = roles.can('admin')[action](resource);
    console.log('permission',permission);
    if (!permission.granted) {
     return res.status(401).json({
      error: "You don't have enough permission to perform this action"
     });
    }
    next()
   } catch (error) {
    console.log(error)
   }
  }
 }

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
    console.log('******************************', )
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
    console.log('userrr',user);
  } catch (error) {
    const err = new Error("Somthing went wrong. could not find user!");
    err.code = 500;
    return next(err);
  }


  if(user)
     res.status(200).json({ user: user.toObject({ getters: true }) });
  else 
    res.status(500).json({
      message: 'user not exist',
      code: "500"
  });
};

const addUser = async (req, res, next) => {


 
  const { firstname, lastname, cin, email, birthday, governorate, role, center,city } = req.body;


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
    role : role || "enrolled",
    centers: center || 'NULL'

  });

  try {
    await createdUser.save({}, async (err, clt) => {
      console.log("idin ahmed fi ")
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
  console.log('***************************', req.body)
  // const { firstname, lastname, cin, email, governorate, birthday, role, center } = req.body;
  // const userCin = req.params.cin;

  const userCin = req.body.cin;
  var userObject;

  let updatedUser;
  try {
    updatedUser = await User.findOne({ cin: userCin });
    userObject = updatedUser;
  } catch (error) {
    console.error('error',error);
    const err = new Error("Somthing went wrong. could not update user!");
    err.code = 500;
    return next(err);
  }

  if(updatedUser)
  updatedUser={
    ...updatedUser,
    ...req.body
  };
  User.updateOne({ cin: userCin }, { $set:req.body})
    .then(result => {
        console.log('enter success');
        res
        .status(200)
        .json({ user: userObject.toObject({ getters: true }) });
      } )
   .catch (err=>{
    console.error('sec err',err);
    const error = new Error("Updating user failed. Please try again!");
    error.code = 500;
    return next(error);
  });
}

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  console.log('called*********************************')

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
exports.grantAccess = grantAccess;