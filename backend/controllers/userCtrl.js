const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { INVALID_CREDENTAILS } = require("../config/errors");

// sign up
const createUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;
    const user = await new User({ username, email, mobile, password });
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

// sign in OR log in

const LoginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    const test = await foundUser.isPasswordMatched(password);
    console.log("test::", test);
    if (foundUser && (await foundUser.isPasswordMatched(password))) {
      res.status(200).send({
        message: "User Login Successful !",
        username: foundUser?.username,
        // password: foundUser?.password,
        mobile: foundUser?.mobile,
        token: generateToken(foundUser?._id),
        role: foundUser?.role,
      });
    } else {
      res.json({ message: INVALID_CREDENTAILS });
      throw new Error({ message: INVALID_CREDENTAILS });
    }
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

// Get All Users

const GetAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});

// Get a single Users

const GetSingleUsers = asyncHandler(async (req, res) => {
  const userId = req.userId;
  try {
    const users = await User.findById(userId);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching Users" });
    console.error(err);
  }
});

module.exports = { createUser, LoginUser, GetAllUsers, GetSingleUsers };
