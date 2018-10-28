const express = require("express");
const router = express.Router();

// @route   get api/users/test
// @desc    Tests users route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//Have to export the router for the server.js file to pick it up.
module.exports = router;
