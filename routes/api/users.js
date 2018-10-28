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

      //Testing
      console.log("name: " + req.body.name);
      console.log("email: " + req.body.email);
      console.log("Avatar: " + avatar);
      console.log("Password: " + req.body.password);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      }); // mongoose new then model name
      //es6 will let you just type avatar, since they are the same... but i will ignore that.

      bcrypt.genSalt(10, (_err, salt) => {
        bcrypt.hash(newUser.password, salt, (_err, hash) => {
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

//Have to export the router for the server.js file to pick it up.
module.exports = router;
