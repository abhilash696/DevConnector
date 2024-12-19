const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const keys = require("./config/keys");
const user_router = require("./routes/api/users.js");
const posts_router = require("./routes/api/posts.js");
const profiles_router = require("./routes/api/profiles.js");
const passport = require("passport");
const cors = require("cors");

const App = express();

App.use(bodyParser.urlencoded({ extended: true }));

App.use(bodyParser.json());

App.use(cors());
mongoose
  .connect(keys.mongodb_url)
  .then(console.log("connection succesfull"))
  .catch((err) => {
    console.log(err);
  });

App.use(passport.initialize());

require("./config/passport")(passport);

App.get("/", (req, res) => {
  res.json({ msg: "hi,this is home page" });
});

App.use("/api/user", user_router);
App.use("/api/profile", profiles_router);
App.use("/api/post", posts_router);

App.listen(8080, () => {
  console.log("app running on port 8080");
});
