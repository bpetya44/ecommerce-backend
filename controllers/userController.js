const User = require("../models/userModel");

const createUser = async (req, res) => {
  const { first_name, last_name, email, mobile, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // Create a new user
    const user = User.create(req.body);
    res.status(200).json({ message: "User created successfully" });
  } else {
    // User already exists
    res.status(400).json({ message: "User already exists" });
  }
};
module.exports = { createUser };
