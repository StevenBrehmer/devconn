const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

//Have to export the router for the server.js file to pick it up.
module.exports = router;
