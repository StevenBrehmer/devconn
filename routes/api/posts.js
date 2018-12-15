const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Brin gin Post Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Bring in Validator
const validatePostInput = require("../../validation/post");

// @route   get api/posts/test
// @desc    Tests post route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts
// @desc    Get Posts
// @access  Public route
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostserror: " No Posts with that ID" })
    );
});

// @route   GET api/posts/:id
// @desc    Get Posts by id
// @access  Public route
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noposterror: " No Post with that ID" })
    );
});

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

// @route   DELETE api/posts/:id
// @desc    DELETE Posts by id
// @access  private route
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            //if you do not own the post...
            return res
              .status(401)
              .json({ notauthorized: "user not authorized" });
          }
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ postdelete: " unable to delete post" })
        );
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Add like to a post
// @access  private route
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User has already liked this post" });
          }
          //add user id to the array of likes
          post.likes.push({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postlike: " unable to like post" })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    remove like from a post
// @access  private route
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(404)
              .json({ notliked: "User has not liked this post" });
          }
          //remove user id to the array of likes

          // get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //splice from array
          post.likes.splice(removeIndex, 1);

          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postunlike: " unable to unlike post" })
        );
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to a post
// @access  private route
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //add to comments array
        post.comments.push(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: " postnotfound" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    remove comment from a post
// @access  private route
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ notcommented: "User has not commented on this post" });
        }
        //remove user id to the array of comments

        // get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        //splice from array
        post.comments.splice(removeIndex, 1);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ commentdelete: " unable to delete comment" })
      );
  }
);
//Have to export the router for the server.js file to pick it up.
module.exports = router;
