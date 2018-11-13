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

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //quick test to see if this is a profile
        if (!profile) {
          errors.noprofile = "There is no profile for that user. ";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create user profile
// @access  Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // gather all fields that come in
    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    // Split skills into array from CSV
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    if (req.body.skills) profileFields.skills = req.body.skills;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (req.body.experience.title)
      profileFields.experience.title = req.body.experience.title;
    if (req.body.experience.company)
      profileFields.experience.company = req.body.experience.company;
    if (req.body.experience.location)
      profileFields.experience.location = req.body.experience.location;
    if (req.body.experience.from)
      profileFields.experience.from = req.body.experience.from;
    if (req.body.experience.to)
      profileFields.experience.to = req.body.experience.to;
    if (req.body.experience.current)
      profileFields.experience.current = req.body.experience.current;
    if (req.body.experience.description)
      profileFields.experience.description = req.body.experience.description;
  }
);

//Have to export the router for the server.js file to pick it up.
module.exports = router;
