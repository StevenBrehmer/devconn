const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Bring user model
const User = require("../../models/User");

// @route   get api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (_req, res) => res.json({ msg: "Users Works" }));

// @route   get api/users/register
// @desc    register a user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already existst" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      }); // mongoose new then model name
      //es6 will let you just type avatar, since they are the same... but i will ignore that.

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   get api/users/login
// @desc    log in user/ Returning JWT or jason web token
// @access  Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find the user by email.
  //Reference the Find one function for mongoose model.
  //First email is from the User model, the second is the variable declared above
  //es6 shortcut, instad of calling email: email... just say email,
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      console.log("noUser");
      return res.status(404).json({ email: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          res.json({ msg: "Success" });
        } else {
          return res.status(404).json({ password: "Password Incorrect" });
        }
      });
    }
  });
});

//Have to export the router for the server.js file to pick it up.
module.exports = router;
