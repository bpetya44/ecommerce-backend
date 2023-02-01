const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/userController");

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/all", getAllUsers);
router.get("/:id", getUserById);

router.delete("/:id", deleteUserById);

module.exports = router;
