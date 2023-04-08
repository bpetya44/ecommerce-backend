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
  // updateOrderStatus,
  // getAllOrders,
  // getOrderById,
  removeProductFromCart,
  updateProductQuantityFromCart,
  createOrder,
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
router.get("/cart-get", authMiddleware, getUserCart);
router.post("/cart/create-order", authMiddleware, createOrder);
router.put("/password", authMiddleware, updateUserPassword);
// router.post("/cart/apply-coupon", authMiddleware, applyCouponToUserCart);
// router.put(
//   "/order/update-order/:id",
//   authMiddleware,
//   adminMiddleware,
//   updateOrderStatus
// );

router.get("/refresh", handleRefreshToken);
router.get("/all-users", getAllUsers);
//router.get("/get-orders", authMiddleware, getUserOrders);
// router.get("/get-all-orders", authMiddleware, getAllOrders);
// router.post("/get-order/:id", authMiddleware, getOrderById);
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

router.put("/edit-user", authMiddleware, updateUserById);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unBlockUser);

module.exports = router;
