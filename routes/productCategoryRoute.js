const express = require("express");
const {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getProductCategory,
  getAllProductCategories,
} = require("../controllers/productCategoryController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createProductCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateProductCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProductCategory);

router.get("/:id", getProductCategory);
router.get("/", getAllProductCategories);

module.exports = router;
