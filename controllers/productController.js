const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

//create product
const createProduct = asyncHandler(async (req, res) => {
  res.json({
    message: "Hey this is create product route",
  });
});

module.exports = { createProduct };
