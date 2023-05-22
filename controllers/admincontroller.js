var express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const activatekey = "accountactivatekey123";
const Book = require("../models/book");
const { OAuth2Client } = require("google-auth-library");
const server_secret_key =
  "iamrajesh675gjhchshskijdiucacuijnuijniusjiudjcsdijcjsijcisjijsoisju";
let api_key =
  "s16rcBDzWjgNhJXPEUV9HA3QMSfvpen2GyL7a4F8ubdwICk5KOHPT32vI5b6cSxs8JpUhirCOjqogGwk";

const client = new OAuth2Client(
  "711974125982-gaeieriu9q60ctbps2qpbjitv0374d7l.apps.googleusercontent.com"
);

const clientId =
  "711974125982-gaeieriu9q60ctbps2qpbjitv0374d7l.apps.googleusercontent.com";

function checkadminuser(req, res, next) {
  const tokenheader = req.body.headers || req.headers["servertoken"];
  console.log(tokenheader, req.headers, "tokenheader");
  if (tokenheader) {
    jwt.verify(tokenheader, activatekey, function (err, decoded) {
      if (!err) {
        req.body.uidfromtoken = decoded.userid;
      }
      next();
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
}

router.get("/getuser/:id", checkadminuser, async function (req, res) {
  try {
    const user = await User.findOne({ _id: { $eq: req.body.uidfromtoken } });
    if (user?.type == "admin") {
      res.status(200).json({
        message: user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "no user",
      });
    }
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "no user",
    });
  }
});

router.post("/addbook", checkadminuser, async (req, res) => {
  console.log(req.body, "body");
  const status = await Book.create({
    name: req.body.name,
    postedby: req.body.postedby,
    image: req.body.url,
    quantity: req.body.quantity,
    author: req.body.author,
    description: "it is very good book",
  });
  try {
    if (status) {
      res.status(200).json({
        message: "success",
        statuses: status,
      });
    }
  } catch {
    res.status(200).json({
      message: "not saved",
    });
  }
});

router.get("/delete/:id", checkadminuser, async (req, res) => {
  const a = await Book.findByIdAndDelete(req.params.id);
  try {
    if (a) {
      const books = await Book.find();
      res.status(200).json({
        message: "success",
        books: books,
      });
    }
  } catch {
    res.status(200).json({
      message: "not saved",
    });
  }
});

router.post("/edit/:id", checkadminuser, async (req, res) => {
  console.log("hello");
  const book = await Book.findById(req.params.id);
  try {
    if (book) {
      book.name = req.body.name;
      book.postedby = req.body.postedby;
      book.image = req.body.url;
      book.quantity = req.body.quantity;
      book.author = req.body.author;
      await book.save();
      const books = await Book.find();
      res.status(200).json({
        message: "success",
        books: books,
      });
    }
  } catch {
    res.status(200).json({
      message: "not saved",
    });
  }
});
module.exports = router;
