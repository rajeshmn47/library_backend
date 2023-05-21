var express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");
const cheerio = require("cheerio");
const router = express.Router();
const Book = require("../models/book");

module.exports.storeit = async function (id) {
  const results = [];
  url = `https://openlibrary.org/${id}`;
  const options = {
    method: "get",
    url: url,
  };
  let promise = new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      }
      // console.log(body)
      resolve(body);
    });
  });
  promise
    .then(async (s) => {
      $ = cheerio.load(`${s}`);
      const tableh = $("tr");
      const listItems = $(".coverFloatHead > h2"); // 2
      listItems.each(function (idx, el) {
        let title;
        if (idx == 0) {
          console.log($(el).text().split("\n").join("").split(" ").join("_"));
          title = $(el).text().split("\n").join("").split(" ").join("_");
        }
        url = `https://openlibrary.org/books/OL25025188M/${title}`;
        const options = {
          method: "get",
          url: url,
        };
        let promise = new Promise((resolve, reject) => {
          request(options, function (error, response, body) {
            if (error) {
              reject(error);
            }
            // console.log(body)
            resolve(body);
          });
        });
      });
      promise.then(async (s) => {
        $ = cheerio.load(`${s}`);
        let username;
        let author;
        let url;
        let description;
        let quantity = 5;
        let postedby = "64698a1c25d388dfef3f295f";
        const listItemse = $(".desktop-book-header"); // 2
        listItemse.each(function (idx, el) {
          if (idx == 0) {
            console.log($(el).text().split("\n")[9]);
            console.log($(el).text().split("\n")[3]);
            username = $(el).text().split("\n")[9];
          }
        });
        const listItemsr = $(".edition-byline > a"); // 2
        listItemsr.each(function (idx, el) {
          if (idx == 0) {
            console.log($(el).text());
            author = $(el).text();
          }
        });

        const listItemsru = $(".coverMagic"); // 2
        listItemsru.each(function (idx, el) {
          console.log("https:" + $(el).find("a").attr("href"), "text");
          url = "https:" + $(el).find("a").attr("href");
        });
        const listItemsrux = $(".book-description"); // 2
        listItemsrux.each(function (idx, el) {
          console.log($(el).find("p").text().split("\n")[1], "text");
          description = $(el).find("p").text().split("\n")[1];
        });
        const status = await Book.create({
          name: username,
          postedby: postedby,
          image: url,
          quantity: quantity,
          author: author,
          description: description,
        });
      });
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
};
