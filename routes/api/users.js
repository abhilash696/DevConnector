const express = require("express");
const User = require("./../../models/User.js");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");
const passport = require("passport");
const register_validator = require("./../../validators/registerValidator.js");
const login_validator = require("./../../validators/loginValidator.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("user home");
});

router.post("/register", async (req, res) => {
  const { errors, isValid } = register_validator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const user = await User.findOne({ email });

  if (user) {
    errors.email = "email already exists";
    return res.status(404).json(errors);
  } else {
    var avatar = gravatar.url(req.body.email, { s: "200", r: "pg", d: "mp" });

    const new_user = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
    });

    bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        try {
          new_user.password = hash;
          await new_user.save();
          res.send({ name: new_user.name, avatar: new_user.avatar });
        } catch (err) {
          res.status(404).json({ user: err });
        }
      });
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { errors, isValid } = login_validator(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    } else {
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (!isMatch) {
          errors.password = "password incorrect";
          return res.status(400).json(errors);
        } else {
          const jwt_payload = {
            id: user._id,
            name: user.name,
            avatar: user.avatar,
          };
          jwt.sign(
            jwt_payload,
            keys.secretOrkey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        }
      });
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get(
  "/currUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
