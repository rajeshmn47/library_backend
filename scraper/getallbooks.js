var express = require("express");
const jwt = require("jsonwebtoken");
const request = require("request");
const cheerio = require("cheerio");
const storeit = require("./scrapdata");
const router = express.Router();

module.exports.getallbooks = async function () {
  const results = [];
  url = "https://openlibrary.org";
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
      const listItems = $(".book-cover > a"); // 2
      listItems.each(async function (idx, el) {
        let title;
        console.log($(el).attr("href"), "el");
        let id = $(el).attr("href");
        await storeit.storeit(id);
      });
    })
    .catch((err) => {
      console.log("Error : " + err);
    });
};
