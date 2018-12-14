const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Brin gin Post Model
const Post = require("../../models/Post");

// Bring in Validator
const validatePostInput = require("../../validation/post");

// @route   get api/posts/test
// @desc    Tests post route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   POST api/posts
// @desc    Add a Post
// @access  Private route

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//Have to export the router for the server.js file to pick it up.
module.exports = router;
