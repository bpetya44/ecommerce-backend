const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/jwt");
const generateRefreshToken = require("../config/refreshToken");
const sendEmail = require("../controllers/emailController");

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;
  const findEmail = await User.findOne({ email });
  const findMobile = await User.findOne({ mobile });
  if (!findEmail && !findMobile) {
    // Create a new user
    const user = User.create(req.body);
    res.status(200).json(user);
  } else {
    // User already exists
    //res.status(400).json({ message: "User already exists" });
    throw new Error("User already exists");
  }
});

// Login user and generate token
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if user exists
  const findUser = await User.findOne({ email });
  const isPasswordMatch = await findUser.isPasswordMatch(password);

  if (findUser && isPasswordMatch) {
    // Generate refresh token
    const refreshToken = await generateRefreshToken(findUser?._id);
    //console.log(refreshToken);
    const updateUser = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.name,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    //res.status(400).json({ message: "Invalid credentials. Please try again" });
    throw new Error("Invalid credentials. Please try again");
  }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  //console.log(cookie);

  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookie");
  }
  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("No matched refresh token in db");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is an error with the refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//Logout user
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }

  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});

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
      }
    );

    res.json({ message: "User blocked successfully" });
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
      }
    );

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

//update user password
const updateUserPassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

// Forgot password token
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with this email");
  }

  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, please click on the link to reset your Password. This link will expire in 10 minutes. 
      <a href='http://localhost:4000/api/user/reset-password${token}' >Click here to reset your password</a>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }

  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/resetpassword/${resetToken}`;
  // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: "Password reset token",
  //     message,
  //   });
  //   res.status(200).json({ success: true, data: "Email sent" });
  // } catch (error) {
  //   console.log(error);
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;
  //   await user.save({ validateBeforeSave: false });
  //   throw new Error("Email could not be sent");
  // }

  // res.json(user);
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
  handleRefreshToken,
  logout,
  updateUserPassword,
  forgotPassword,
};
