const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRoute = require("./routes/authRoute");

dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use("/api/user", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Path: .env
