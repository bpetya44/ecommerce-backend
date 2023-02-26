const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// create a new color
const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.status(200).json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

//get a color by id
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const color = await Color.findById(id);
    res.status(200).json(color);
  } catch (error) {
    throw new Error(error);
  }
});

//get all colors
const getAllColors = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    throw new Error(error);
  }
});

//update a color
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateColor);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a color
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteColor = await Color.findByIdAndDelete(id);
    res.status(200).json(deleteColor);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColors,
};
