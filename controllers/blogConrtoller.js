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
  validateMongodbId(id);

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
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

//get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (null) {
      throw new Error("item id is required");
    }
    const blog = await Blog.findByIdAndDelete(id);
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// Like a blog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  // find the blog to be liked
  const blog = await Blog.findById(blogId);

  //find the logged in user
  const loggedUserId = req.user._id;

  // check if the user has already liked the blog
  const isLiked = blog?.isLiked; //false
  //console.log(blog.dislikes);
  // check if the user has already disliked the blog
  const alredyDisliked = blog?.dislikes?.find(
    (userId) => userId.toString() === loggedUserId.toString()
  );
  if (alredyDisliked) {
    // remove the user from the dislikes array
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loggedUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  }
  // check if the user has already liked the blog
  if (isLiked) {
    // remove the user from the likes array
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loggedUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }
  // add the user to the likes array
  await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { likes: loggedUserId },
      isLiked: true,
    },
    {
      new: true,
    }
  );
  res.status(200).json(blog);
});

// Dislike a blog
const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  // find the blog to be disliked
  const blog = await Blog.findById(blogId);

  //find the logged in user
  const loggedUserId = req.user._id;

  // check if the user has already disliked the blog
  const isDisliked = blog?.isDisliked; //true

  // check if the user has already liked the blog
  const alredyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loggedUserId?.toString()
  );
  if (alredyLiked) {
    // remove the user from the likes array
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loggedUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }
  // check if the user has already disliked the blog
  if (isDisliked) {
    // remove the user from the dislikes array
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loggedUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  }
  // add the user to the dislikes array
  await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { dislikes: loggedUserId },
      isDisliked: true,
    },
    {
      new: true,
    }
  );
  res.status(200).json(blog);
});

// export the functions

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
