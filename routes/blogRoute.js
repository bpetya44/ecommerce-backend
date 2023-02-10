const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
} = require("../controllers/blogConrtoller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createBlog);
router.put("/:id", authMiddleware, adminMiddleware, updateBlog);
router.get("/:id", authMiddleware, adminMiddleware, getBlog);

module.exports = router;
