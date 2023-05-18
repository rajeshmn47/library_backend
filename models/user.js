const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "normal",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
