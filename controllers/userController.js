const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/jwt");
const generateRefreshToken = require("../config/refreshToken");
const sendEmail = require("../controllers/emailController");
const crypto = require("crypto");
const uniqid = require("uniqid");
const { log } = require("console");

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;
  const findEmail = await User.findOne({ email });
  const findMobile = await User.findOne({ mobile });
  if (!findEmail && !findMobile) {
    // Create a new user
    const user = await User.create(req.body);
    res.status(200).json(user);
  } else {
    // User already exists
    //res.status(400).json({ message: "User already exists" });
    if (findEmail) throw new Error("Email already exists");
    if (findMobile) throw new Error("Mobile already exists");
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
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      },
      { secure: true }
    );
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
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

//Admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if user exists
  const findAdmin = await User.findOne({ email });
  if (!findAdmin || findAdmin.role !== "admin")
    throw new Error("Not authorized");
  const isPasswordMatch = await findAdmin.isPasswordMatch(password);

  if (findAdmin && isPasswordMatch) {
    // Generate refresh token
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    //console.log(refreshToken);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      },
      { secure: true }
    );
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
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

// Save user address
const saveUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { address } = req.body;
  validateMongodbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { address },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
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
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findById(_id);

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
    const resetUrl = `Hi ${user.firstName}, please click on the link to reset your Password. <br>This link will expire in 10 minutes. 
      <a href='http://localhost:4000/api/user/reset-password/${token}'><br> Click here to reset your password</a>`;

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
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token is invalid or has expired.Try again");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

//Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    //get user wishlist with product details
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//add to User Cart
const addToUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, color, quantity, price } = req.body;
  validateMongodbId(_id);
  try {
    //create new cart
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      quantity,
      price,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

//Get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  validateMongodbId(_id);
  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color")
      .exec();
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//delete product from user cart
const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  console.log(cartItemId);
  validateMongodbId(_id);
  try {
    const deleteProductFromCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.json(deleteProductFromCart);
  } catch (error) {
    throw new Error(error);
  }
});

//update product quantity in user cart
const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;

  validateMongodbId(_id);
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
    cartItem.quantity = newQuantity;
    const updateProductQuantity = await cartItem.save();

    res.json(updateProductQuantity);
  } catch (error) {
    throw new Error(error);
  }
});

//empty user cart
const emptyUserCart = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderedBy: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//apply coupon
const applyCouponToUserCart = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    //console.log(validCoupon);
    //if coupon is invalid
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }

    //if coupon is valid
    const userCart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product",
      "_id title price"
    );
    console.log(userCart);
    //calculate cart total after discount
    let { products, cartTotal } = userCart;
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    //update cart
    await Cart.findOneAndUpdate(
      { orderedBy: _id },
      { totalAfterDiscount },
      { new: true }
    ).exec();
    res.json(totalAfterDiscount);

    //console.log(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

//create order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  if (!COD) throw new Error("Create cash order failed");

  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findById(_id);
    const userCart = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();
    //console.log(userCart);
    //create order
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    const newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        currency: "usd",
        status: "Cash On Delivery",
        created: Date.now(),
        payment_method_types: ["cash"],
      },
      orderedBy: user._id,
      orderStatus: "Cash On Delivery",
    }).save();
    //decrement quantity, increment sold
    const bulkOption = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    let updated = await Product.bulkWrite(bulkOption, {});
    console.log(updated);
    res.json(newOrder);
  } catch (error) {
    throw new Error(error);
  }
});

//Get User's orders
// const getUserOrders = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   validateMongodbId(_id);
//   try {
//     const orders = await Order.find({ orderedBy: _id })
//       .populate("products.product")
//       .populate("orderedBy")
//       .exec();

//     res.json(orders);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

//Get Order By User Id
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const orders = await Order.find({ orderedBy: id })
      .populate("products.product")
      .populate("orderedBy")
      .exec();

    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

//Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})

      .populate("products.product")
      .populate("orderedBy")
      .exec();

    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

//Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: { status: status },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json(order);
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
  handleRefreshToken,
  logout,
  updateUserPassword,
  forgotPassword,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveUserAddress,
  addToUserCart,
  getUserCart,
  emptyUserCart,
  applyCouponToUserCart,
  createOrder,
  // getUserOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  removeProductFromCart,
  updateProductQuantityFromCart,
};
