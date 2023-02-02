const mongoose = require("mongoose");

const validateMongodbId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }
};
module.exports = validateMongodbId;
