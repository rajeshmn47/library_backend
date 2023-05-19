var express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const activatekey = "accountactivatekey123";
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

router.post("/googlelogin", async function (req, res, next) {
  var tokenId = req.body.tokenId;
  var verifyObject = {};
  verifyObject.idToken = tokenId;
  verifyObject.audience = clientId;
  var response = await client.verifyIdToken(verifyObject);
  const { email_verified } = response.payload;
  if (email_verified) {
    console.log(response.payload);
    const usert = await User.findOne({
      email: { $eq: response.payload.email },
    });
    if (usert) {
      usert.image = response.payload.picture;
      await usert.save();
      let userid = usert._id;
      const server_token = jwt.sign({ userid }, activatekey, {
        expiresIn: "5000000m",
      });
      res.status(200).json({
        success: true,
        usert,
        server_token,
      });
    } else {
      const user1 = new User();
      user1.username = response.payload.name;
      user1.email = response.payload.email;
      user1.image = response.payload.picture;
      user1.password = "password";
      user1.phonenumber = 7259293140;
      user1.wallet = 10000;
      User.findOne(
        { email: response.payload.email },
        async function (err, user) {
          if (err) {
            console.log("Error in finding user in Sign-in ");
            res.status(400).json({
              message: "something went wrong",
            });
          }
          if (!user) {
            transaction.createTransaction(userId, "", 100, "extra cash");
            User.create(user1, async function (err, user) {
              if (err) {
                console.log("rajesh");
                console.log(
                  "Error in creating a user while account activation",
                  err
                );
                res.status(400).json({
                  message: "something went wrong",
                });
              } else {
                var userid = user._id;
                console.log("SignUp successfull!");
                const token = jwt.sign({ userid }, activatekey, {
                  expiresIn: "500000m",
                });
                res.status(200).json({
                  success: true,
                  user,
                  server_token,
                });
              }
            });
          } else {
            console.log("kuttheee");
            res.status(200).json({
              message: "user already exists",
              success: false,
            });
          }
        }
      ).catch((err) => {
        console.log("Error : " + err);
      });
    }
  } else {
    res.json({
      status: 403,
      message: "Email Not Verified, use another method to login!",
    });
  }
});

function checkloggedinuser(req, res, next) {
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

router.post("/register", async (req, res) => {
  console.log(req.body, "body");
  const user1 = new User();
  user1.username = req.body.username;
  user1.email = req.body.email;
  user1.password = req.body.password;
  user1.phonenumber = "phonenumber";
  user1.type = "admin";
  User.findOne({ email: req.body.email }, async function (err, user) {
    if (err) {
      console.log("Error in finding user in Sign-in ");
      res.status(400).json({
        message: "something went wrong",
      });
    }
    if (!user) {
      User.create(user1, async function (err, user) {
        if (err) {
          console.log("rajesh");
          console.log("Error in creating a user while account activation", err);
          res.status(400).json({
            message: "something went wrong",
          });
        } else {
          var userid = user._id;
          console.log("SignUp successfull!");

          const token = jwt.sign({ userid }, activatekey, {
            expiresIn: "5000000m",
          });

          res.status(200).json({
            message: "enter otp recieved on your mail to activate your account",
            success: true,
          });
        }
      });
    } else {
      console.log("kuttheee");
      res.status(200).json({
        message: "user already exists",
        success: false,
      });
    }
  }).catch((err) => {
    console.log("Error : " + err);
  });
});
router.post("/otp", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user.otp, req.body.otp, "otp");
  if (parseInt(user.otp) == parseInt(req.body.otp)) {
    user.verified = true;
    let userid = user._id;
    const token = jwt.sign({ userid }, activatekey, {
      expiresIn: "5000000m",
    });
    user.save(function (err) {
      if (!err) {
        console.log("contact");
        res.status(200).json({
          message: "ure account created successfully u can login",
          token: token,
        });
      } else {
        console.log("Error: could not save contact ");
        res.status(200).json({
          message: "ure account created successfully u can login",
          token: token,
        });
      }
    });
  } else {
    res.status(200).json({
      message: "ure account failed to create successfully",
    });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body, "body");
  const user = await User.findOne({ email: req.body.myform.email });
  if (user) {
    console.log(user, "user");
    if (user.password == req.body.myform.password) {
      console.log(user, "user");
      var userid = user._id;
      const token = jwt.sign({ userid }, activatekey, {
        expiresIn: "50000000m",
      });
      res.status(200).json({
        message: "success",
        token: token,
        user: user,
      });
    } else {
      res.status(400).json({
        message: "password is wrong",
      });
    }
  } else {
    res.status(400).json({
      message: "no user exists",
    });
  }
});

router.get("/forgot-password/:email", async (req, res) => {
  const otp = otpGenerator.generate(8, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    specialChars: false,
  });
  console.log(req.params.email, "email");
  try {
    const user1 = await User.findOne({ email: req.params.email });
    console.log(user1, "user1");
    if (user1) {
      user1.otp = otp;
      var mailOptions = {
        from: "rajeshmn47@gmail.com",
        to: req.params.email,
        subject: "Sending Email using Node.js[nodemailer]",
        text: `enter this otp ${otp}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      await user1.save();
      var userid = user1._id;
      const token = jwt.sign({ userid }, activatekey, {
        expiresIn: "500m",
      });

      res.status(200).json({
        message: "enter otp recieved on your mail to activate your account",
        success: true,
      });
    } else {
      console.log("kuttheee");
      res.status(200).json({
        message: "could not send",
        success: false,
      });
    }
  } catch (err) {
    console.log("Error : " + err);
    res.status(200).json({
      message: "their was some error",
      success: false,
    });
  }
});

router.post("/forgot-password-otp", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user.otp, req.body.otp, "otp");
  if (parseInt(user.otp) == parseInt(req.body.otp)) {
    let userid = user._id;
    const token = jwt.sign({ userid }, activatekey, {
      expiresIn: "500m",
    });
    user.save(function (err) {
      if (!err) {
        console.log("contact");
        res.status(200).json({
          message: "u can change your password",
          token: token,
          success: true,
        });
      } else {
        console.log("Error: could not save contact ");
        res.status(200).json({
          message: "found some error",
          success: false,
        });
      }
    });
  } else {
    res.status(200).json({
      message: "entered otp is wrong",
    });
  }
});

router.post("/changepassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user.otp, req.body.otp, "otp");
  user.password = req.body.password;
  user.save(function (err) {
    if (!err) {
      console.log("contact");
      res.status(200).json({
        message: "password changed successfully please login",
        success: true,
      });
    } else {
      console.log("Error: could not save contact ");
      res.status(200).json({
        message: "could not change password",
        success: false,
      });
    }
  });
});

router.get("/loaduser", checkloggedinuser, async function (req, res) {
  try {
    const user = await User.findOne({ _id: { $eq: req.body.uidfromtoken } });
    if (user) {
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
module.exports = router;
