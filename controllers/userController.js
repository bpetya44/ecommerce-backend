const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwt");
const validateMongodbId = require("../utils/validateMongodbId");

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;
  const findEmail = await User.findOne({ email });
  const findMobile = await User.findOne({ mobile });
  if (!findEmail && !findMobile) {
    // Create a new user
    const user = User.create(req.body);
    res.status(200).json({ message: "User created successfully" });
  } else {
    // User already exists
    //res.status(400).json({ message: "User already exists" });
    throw new Error("User already exists");
  }
});

// Login user and generate token
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //console.log(email, password);

  //check if user exists
  const findUser = await User.findOne({ email });
  if (findUser) {
    // User exists
    // Check if password matches
    const isPasswordMatch = await findUser.isPasswordMatch(password);
    if (isPasswordMatch) {
      // Password matches
      //res.json(findUser);
      res.status(200).json({
        message: "User logged in successfully",
        _id: findUser?._id,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
        email: findUser?.email,
        mobile: findUser?.mobile,
        role: findUser?.role,
        isAdmin: findUser?.isAdmin,
        token: generateToken(findUser?._id),
      });
    } else {
      // Password does not match
      //res.status(400).json({ message: "Invalid credentials" });
      throw new Error("Invalid credentials. Please try again");
    }
  }
});

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

//Get user by id
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    console.log(user);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete user by id
const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    console.log("User deleted successfully");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Update user by id
const updateUserById = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        isAdmin: req.body.isAdmin,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("User updated successfully");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Block user by id
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("User blocked successfully");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Unblock user by id
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("User unblocked successfully");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

//Export all the functions
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  blockUser,
  unBlockUser,
};
