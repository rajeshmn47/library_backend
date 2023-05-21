const activatekey = "accountactivatekey123";
const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");
const { findById } = require("../models/book");
const router = express.Router();
const Book = require("../models/book");

router.post("/addbook", async (req, res) => {
  console.log(req.body, "body");
  const status = await Book.create({
    name: req.body.name,
    postedby: req.body.postedby,
    image: req.body.url,
    quantity: req.body.quantity,
    author: req.body.author,
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

router.get("/delete/:id", async (req, res) => {
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

router.post("/edit/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  try {
    if (book) {
      book.name = req.body.name;
      book.postedby = req.body.postedby;
      book.image = req.body.url;
      (quantity = req.body.quantity), (author = req.body.author);
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

router.get("/getbooks", async (req, res) => {
  try {
    console.log("gretbooksreqauest");
    const books = await Book.find();
    if (books) {
      res.status(200).json({
        message: "success",
        data: books,
      });
    }
  } catch {
    res.status(200).json({
      data: "not saved",
    });
  }
});

router.get("/getbooks/:searchstring", async (req, res) => {
  try {
    console.log("gretbooksreqauest");
    const books = await Book.find({
      name: { $regex: req.params.searchstring },
    });
    if (books) {
      res.status(200).json({
        message: "success",
        data: books,
      });
    }
  } catch {
    res.status(200).json({
      data: "not saved",
    });
  }
});

router.get("/getbook/:id", async (req, res) => {
  try {
    console.log("gretbooksreqauest");
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json({
        message: "success",
        data: book,
      });
    }
  } catch {
    res.status(200).json({
      data: "cant find",
    });
  }
});

router.post("/request/:id", async (req, res) => {
  console.log(req.body, "ReWQUEST");
  const book = await Book.findById(req.params.id);
  try {
    if (book) {
      book.requests.push({ requestedBy: req.body.userId });
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

router.post("/cancelrequest/:id", async (req, res) => {
  console.log(req.body, "cancelreqs");
  const book = await Book.findById(req.params.id);
  try {
    if (book) {
      let requests = book.requests;
      let reqs = requests.filter((r) => !(r.requestedBy == req.body.userId));
      book.requests = reqs;
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
