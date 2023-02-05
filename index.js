const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRoute = require("./routes/authRoute");
const productRouter = require("./routes/productRouter");
const cookieParser = require("cookie-parser");

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", authRoute);
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
