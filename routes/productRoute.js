const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImage");

const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  addRating,
  uploadImages,
  deleteImages,
} = require("../controllers/productController");

router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put(
  "/upload/",
  authMiddleware,
  adminMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.get("/:id", getProduct);
router.get("/", getAllProducts);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, addRating);

router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.delete(
  "/delete-image/:id",
  authMiddleware,
  adminMiddleware,
  deleteImages
);

module.exports = router;
