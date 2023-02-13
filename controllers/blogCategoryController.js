const BlogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// create a new category
const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//get a category by id
const getBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await BlogCategory.findById(id);
    res.status(200).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

//get all categories
const getAllBlogCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    throw new Error(error);
  }
});

//update a category
const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a category
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await BlogCategory.findByIdAndDelete(id);
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
  getAllBlogCategories,
};
