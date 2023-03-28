const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
} = require("../controllers/couponController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createCoupon);
router.get("/", authMiddleware, adminMiddleware, getAllCoupons);
router.get("/:id", authMiddleware, adminMiddleware, getCouponById);
router.put("/:id", authMiddleware, adminMiddleware, updateCoupon);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);
//router.get("/", getCoupon);

module.exports = router;
