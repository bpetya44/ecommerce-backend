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
} = require("../controllers/userController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/forgot-password", forgotPassword);
router.post("/login", loginUser);
router.put("/password", authMiddleware, updateUserPassword);

router.get("/refresh", handleRefreshToken);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.get("/logout", logout);

router.delete("/:id", deleteUserById);

router.put("/edit-user/", authMiddleware, updateUserById);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unBlockUser);

module.exports = router;
