const BrandCategory = require("../models/brandCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// create a new category
const createBrandCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BrandCategory.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//get a category by id
const getBrandCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await BrandCategory.findById(id);
    res.status(200).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

//get all categories
const getAllBrandCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BrandCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

//update a category
const updateBrandCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await BrandCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a category
const deleteBrandCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await BrandCategory.findByIdAndDelete(id);
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrandCategory,
  updateBrandCategory,
  deleteBrandCategory,
  getBrandCategory,
  getAllBrandCategories,
};
