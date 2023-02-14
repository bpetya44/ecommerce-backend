const express = require("express");
const {
  createBrandCategory,
  updateBrandCategory,
  deleteBrandCategory,
  getBrandCategory,
  getAllBrandCategories,
} = require("../controllers/brandCategoryController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createBrandCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateBrandCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBrandCategory);

router.get("/:id", getBrandCategory);
router.get("/", getAllBrandCategories);

module.exports = router;
