const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/user');
const Role = require('../models/role');

const bcrypt = require('bcryptjs');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ roleid: 1 }); 
  } catch (err) {
    return res.status(500).json({ message: 'Fetching users has failed, please try again later' });
  }

  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'No users found.' });
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getAgency = async (req, res, next) => {
  let agencyusers;
  try {
    agencyusers = await User.find({ roleid: 2 }); 
  } catch (err) {
    return res.status(500).json({ message: 'Fetching users has failed, please try again later' });
  }

  if (!agencyusers || agencyusers.length === 0) {
    return res.status(404).json({ message: 'No users found.' });
  }
  res.json({ agencyusers: agencyusers.map(agencyusers => agencyusers.toObject({ getters: true })) });
};

const role = async (req, res, next) => {
  const {name } = req.body;

  const createdRole = new Role({
    name
  });

  try {
    await createdRole.save();
  } catch (err) {
    console.error('Error creating role:', err);
    return res.status(500).json({ message: 'Creating role failed, please try again' });
  }

  res.status(201).json({ role: createdRole.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const { name, email, phone, address, password, roleid } = req.body;

  // Check if email already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(422).json({ message: 'User already exists' });
    }
  } catch (err) {
    console.error('Error finding user:', err);
    return res.status(500).json({ message: 'Signup failed, please try again later' });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  }
  catch(err) {
    return res.status(500).json( { message: 'Could not create user, please try again.'  });
  }

  const createdUser = new User({
    name,
    email,
    phone,
    address,
    password: hashedPassword,
    roleid
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.error('Error saving user:', err);
    return res.status(500).json({ message: 'Creating user failed, please try again' });
  }

  res.status(201).json({status:"Success", message:"Successfully Registered" });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.error('Error finding user:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
  if (!existingUser) {
    return res.status(422).json({ message: 'Invalid credentials' });
  }

  let isValidPassword = false;
  try {
   isValidPassword = await bcrypt.compare(password, existingUser.password);
  }
  catch(err) {
   return res.status(500).json( { message: 'Login failed, please check your credentials'  });
  }

  if(!isValidPassword) {
    return res.status(422).json( { message: 'Invalid credentials'  });
   }

  res.json({status: "Success", message: 'Logged in!', roleid: existingUser.roleid, userid: existingUser.userId });
};

const getUserDetails = async (req, res, next) => {
  const { userId } = req.body;
  let userDetails;
  try {
    userDetails = await User.find({userId: userId}); 
  } catch (err) {
    return res.status(500).json({ message: 'Fetching users has failed, please try again later' });
  }

  if (!userDetails || userDetails.length === 0) {
    return res.status(404).json({ message: 'No users found.' });
  }
  res.json({ userDetails: userDetails.map(userDetails => userDetails.toObject({ getters: true })) });
};


exports.getUsers = getUsers;
exports.getAgency = getAgency;
exports.signup = signup;
exports.login = login;
exports.role = role;
exports.getUserDetails = getUserDetails;
