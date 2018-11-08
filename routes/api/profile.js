const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring Models in User & Profile
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   get api/profile/test
// @desc    Tests profile route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   get api/profile
// @desc    get cur user profile
// @access  Private route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id }).then(profile => {
      //quick test to see if this is a profile
      if (!profile) {
        return res.status(404).json();
      }
    });
  }
);

//Have to export the router for the server.js file to pick it up.
module.exports = router;
