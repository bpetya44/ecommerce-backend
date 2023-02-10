const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// create a new blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(200).json(newBlog);
  } catch (error) {
    throw new Error(error);
  }

  //   const { title, body, author } = req.body;

  //   // check if the author exists
  //   const findAuthor = await User.findById(author);
  //   if (findAuthor) {
  //     // create a new blog
  //     const blog = await Blog.create(req.body);
  //     res.status(200).json(blog);
  //   } else {
  //     //res.status(400).json({ message: "Author does not exist" });
  //     throw new Error("Author does not exist");
  //}
});

//update a blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

//get a blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBlog, updateBlog, getBlog };
