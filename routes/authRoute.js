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
  userCart,
  getUserCart,
  emptyUserCart,
  applyCouponToUserCart,
  createOrder,
  getUserOrders,
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
router.post("/cart", authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCouponToUserCart);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.put("/password", authMiddleware, updateUserPassword);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.get("/refresh", handleRefreshToken);
router.get("/all-users", getAllUsers);
router.get("/get-orders", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getUserById);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/get-cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyUserCart);
router.put("/logout", logout);

router.delete("/:id", deleteUserById);

router.put("/edit-user", authMiddleware, updateUserById);
router.put("/save-address", authMiddleware, saveUserAddress);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unBlockUser);

module.exports = router;
