const ProductCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// create a new category
const createProductCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await ProductCategory.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//get a category by id
const getProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await ProductCategory.findById(id);
    res.status(200).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

//get all categories
const getAllProductCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

//update a category
const updateProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await ProductCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a category
const deleteProductCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await ProductCategory.findByIdAndDelete(id);
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getProductCategory,
  getAllProductCategories,
};
