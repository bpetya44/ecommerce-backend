const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controllers/blogConrtoller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();
const { uploadPhoto, blogImgResize } = require("../middleware/uploadImage");

router.post("/", authMiddleware, adminMiddleware, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  adminMiddleware,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, adminMiddleware, updateBlog);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlogs);

module.exports = router;
