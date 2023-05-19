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
    requests: [
      {
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
          default: "",
        },
        from: {
          type: Date,
          default: Date.now(),
        },
        to: {
          type: Date,
          default: Date.now(),
        },
        approved: { type: Boolean, default: false },
        created: { type: Date, default: Date.now },
      },
    ],
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
