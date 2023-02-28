const Enquiry = require("../models/enquiryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// create a new Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(200).json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

//get a Enquiry by id
const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const enquiry = await Enquiry.findById(id);
    res.status(200).json(enquiry);
  } catch (error) {
    throw new Error(error);
  }
});

//get all Enquirys
const getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.status(200).json(enquiries);
  } catch (error) {
    throw new Error(error);
  }
});

//update a Enquiry
const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a Enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
    res.status(200).json(deleteEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiries,
};
