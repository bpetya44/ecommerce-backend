const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const { createCheckoutSession } = require("../controllers/paymentController");

router.post("/checkout", createCheckoutSession);

module.exports = router;
