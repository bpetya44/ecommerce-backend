const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/userController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/all", getAllUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);

router.delete("/:id", deleteUserById);
router.put("/edit-user/:id", authMiddleware, updateUserById);

module.exports = router;
