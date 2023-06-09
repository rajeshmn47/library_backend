const activatekey = "accountactivatekey123";
const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");
const { findById } = require("../models/book");
const router = express.Router();
const Book = require("../models/book");

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

router.post("/ignore", async (req, res) => {
  try {
    console.log(req.body, "ignorereqs");
    const book = await Book.findById(req.body.bookId);
    let requests = book.requests;
    console.log(requests, "reqs");
    let r = requests.find((k) => k._id.toString() == req.body._id);
    if(r){
    r.approved = false;
    console.log(r);

    requests = [...requests.filter((k)=>!(k._id==r._id)), { ...r }];
    book.requests = requests;
    await book.save();
    res.status(200).json({
      message: "successful",
    });
  }
  else{
    res.status(200).json({
      message: "not saved",
    });
  }
  } catch {
    res.status(200).json({
      message: "not saved",
    });
  }
});

router.post("/approve", async (req, res) => {
  try {
    console.log(req.body, "approvereqs");
    const book = await Book.findById(req.body.bookId);
    let requests = book.requests;
    console.log(requests, "reqs");
    let r = requests.find((k) => k._id.toString() == req.body._id);
    if(r){
    r.approved = true;
    console.log(r);

    requests = [...requests.filter((k)=>!(k._id==r._id)), { ...r }];
    book.requests = requests;
    await book.save();
    res.status(200).json({
      message: "successful",
    });
  }
  else{
    res.status(200).json({
      message: "not saved",
    });
  }
  } catch {
    res.status(200).json({
      message: "not saved",
    });
  }
});

module.exports = router;
