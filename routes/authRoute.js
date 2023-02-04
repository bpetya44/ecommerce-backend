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
} = require("../controllers/userController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/refresh", handleRefreshToken);
router.get("/all", getAllUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.get("/logout", logout);

router.delete("/:id", deleteUserById);

router.put("/edit-user/", authMiddleware, updateUserById);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unBlockUser);

module.exports = router;
