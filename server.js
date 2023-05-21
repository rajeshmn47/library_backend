require("dotenv").config();
var express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var app = express();
const bodyParser = require("body-parser");
// Allowing app to use body parser
const user = require("./controllers/usercontroller");
const book = require("./controllers/bookcontroller");
const admin = require("./controllers/admincontroller");
const getbooks = require("./scraper/getallbooks");
// Allowing app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/auth/", user);
app.use("/", book);
app.use("/", admin);

const uri =
  "mongodb+srv://rajeshmn47:uni1ver%40se@cluster0.bpxam.mongodb.net/library?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      console.log("Error!" + error);
    }
  }
);
async function gettingkeys() {
  const data = await getbooks.getallbooks();
  console.log(data);
}
gettingkeys();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`);
});
