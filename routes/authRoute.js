const express = require("express");
const router = express.Router();
const {
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
  // emptyUserCart,
  // applyCouponToUserCart,
  //getOrderById,
  getAllOrders,
  removeProductFromCart,
  updateProductQuantityFromCart,
  createOrder,
  getMyOrders,
  getMonthIncome,
  getYearOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/userController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/login", loginUser);
router.post("/admin", loginAdmin);
router.post("/cart", authMiddleware, addToUserCart);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/cart-get", authMiddleware, getUserCart);
router.get(
  "/get-month-income",
  authMiddleware,
  adminMiddleware,
  getMonthIncome
);
router.get("/get-year-orders", authMiddleware, adminMiddleware, getYearOrders);
router.post("/cart/create-order", authMiddleware, createOrder);
router.put("/password", authMiddleware, updateUserPassword);
// router.post("/cart/apply-coupon", authMiddleware, applyCouponToUserCart);

router.get("/refresh", handleRefreshToken);
router.get("/all-users", getAllUsers);
//router.get("/get-orders", authMiddleware, getUserOrders);
router.get("/get-all-orders", authMiddleware, adminMiddleware, getAllOrders);
//router.post("/get-order/:id", authMiddleware, getOrderById);
router.get("/get-order/:id", authMiddleware, getOrderById);
router.put(
  "/update-order/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);
router.get("/:id", authMiddleware, getUserById);
router.get("/wishlist", authMiddleware, getWishlist);
//router.post("/cart/apply-coupon", authMiddleware, applyCouponToUserCart);
//router.delete("/empty-cart", authMiddleware, emptyUserCart);
router.delete(
  "/update-product-cart/:cartItemId/:newQuantity",
  authMiddleware,
  updateProductQuantityFromCart
);
router.delete(
  "/delete-product-cart/:cartItemId",
  authMiddleware,
  removeProductFromCart
);

router.put("/logout", logout);

router.delete("/:id", deleteUserById);

router.put("/update-user", authMiddleware, updateUserById);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unBlockUser);

module.exports = router;
