const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validator
const validateProfileInput = require("../../validation/profile");

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
      .populate("user", ["name", "avatar"]) //want to populate user in the Profile model
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

// @route   POST api/profile/all
// @desc    Get All Profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user id" })
    );
});

// @route   POST api/profile/handle/:hanlde
// @desc    get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user id";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user id" })
    );
});

// @route   POST api/profile
// @desc    Create user profile
// @access  Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation of user profile data
    if (!isValid) {
      // Return any 400 errors
      return res.status(400).json(errors);
    }

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

    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //Experience
    /*profileFields.experience = {};
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
      */

    //Social
    //console.log(profileFields);
    profileFields.social = {};
    //console.log(req.body.social);

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    //console.log(profileFields);

    //console.log(req.body);

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update Profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create Profile
        // First check to see if the handle exists. Check if the profile exists in an SEO friendly way
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exists";
            // any validation errors should be throwing a 400 error
            res.status(400).json(errors);
          }

          //Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//Have to export the router for the server.js file to pick it up.
module.exports = router;
