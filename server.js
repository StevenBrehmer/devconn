const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport"); //Look into LDAP for a way too.

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database Configuration
const db = require("./config/keys").mongoURI;

// Connect to Mongo DB
mongoose
  .connect(
    db,
    { useNewUrlParser: true } //Needed to add because current url parser was depreciated...
  )
  .then(() => console.log("MongoDB Live & Connected"))
  .catch(err => console.log(err));

// Dont need this any more :(
// app.get("/", (req, res) => res.send("Hello -- Test"));

// Passport Middleware
app.use(passport.initialize());

// Everythign else we do in passport should be in a config file
// can have a local strategy, or google strategy, or jwt strategy
// Everythign else we do in passport should be in a config file
// can have a local strategy, or google strategy, or jwt strategy
require("./config/passport")(passport);

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
