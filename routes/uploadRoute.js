const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImage");

const {
  uploadImages,
  deleteImages,
} = require("../controllers/uploadController");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete(
  "/delete-image/:id",
  authMiddleware,
  adminMiddleware,
  deleteImages
);

module.exports = router;
