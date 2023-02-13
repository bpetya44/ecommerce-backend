const express = require("express");
const {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
  getAllBlogCategories,
} = require("../controllers/blogCategoryController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createBlogCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateBlogCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBlogCategory);

router.get("/:id", getBlogCategory);
router.get("/", getAllBlogCategories);

module.exports = router;
