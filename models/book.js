const mongoose = require("mongoose");
const crypto = require("crypto");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    postedby: {
      type: String,
      required: true,
    },
    requested_by: {
      type: Array,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("book", bookSchema);
module.exports = User;
