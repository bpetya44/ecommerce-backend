const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");

//create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get a product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
  //console.log(req.query);
  try {
    //Filtering
    // const products = await Product.find({
    //     brand: req.query.brand,
    //     category: req.query.category,
    // });
    // const products = await Product.where("category").equals(req.query.category);
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    //console.log(req.query, queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));

    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numProducts = await Product.countDocuments();
      if (skip >= numProducts) throw new Error("This page does not exist");
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

// Add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  validateMongodbId(_id);
  validateMongodbId(productId);

  try {
    //find user
    const user = await User.findById(_id);
    //check if product already added to wishlist
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      //remove product from wishlist
      const updatedWishlist = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(updatedWishlist);
    } else {
      //add product to wishlist
      const updatedWishlist = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(updatedWishlist);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// add rating
const addRating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, productId, comment } = req.body;
  validateMongodbId(_id);
  validateMongodbId(productId);

  try {
    const product = await Product.findById(productId);
    //check if user already rated the product
    const alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      //add rating
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { ratings: { star: star, comment: comment, postedBy: _id } },
        },
        {
          new: true,
        }
      );
    }

    //get average rating
    const getRating = await Product.findById(productId);
    let totalRatingNum = getRating.ratings.length;

    let ratingSum = getRating.ratings
      .map((rating) => rating.star)
      .reduce((acc, curr) => acc + curr, 0);
    let averageRating = Math.round(ratingSum / totalRatingNum);
    console.log(averageRating);

    //update product rating
    const updateProductRating = await Product.findByIdAndUpdate(
      productId,
      {
        totalrating: averageRating,
      },
      {
        new: true,
      }
    );
    res.json(updateProductRating);
  } catch (error) {
    throw new Error(error);
  }
});

//upload images
const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }

    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete images
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = cloudinaryDeleteImg(id, "images");

    res.json({ message: "Images deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

//exports
module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  addRating,
  uploadImages,
  deleteImages,
};
