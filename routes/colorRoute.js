const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColors,
} = require("../controllers/colorController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createColor);
router.put("/:id", authMiddleware, adminMiddleware, updateColor);
router.delete("/:id", authMiddleware, adminMiddleware, deleteColor);

router.get("/:id", getColor);
router.get("/", getAllColors);

module.exports = router;
