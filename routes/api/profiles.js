const express = require("express");
const passport = require("passport");
const Profile = require("./../../models/Profile.js");
const User = require("./../../models/User.js");
const profile_validator = require("./../../validators/profileValidator.js");
const experience_validator = require("./../../validators/experience_validator.js");
const education_validator = require("./../../validators/education_validator.js");
const { parse } = require("date-fns");

const router = express.Router();

//get profile for current_loggedin_user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name"])
      .then((profile) => {
        if (!profile) {
          errors.profile = "No profile found";
          return res.status(400).json(errors);
        }
        return res.json(profile);
      })
      .catch((err) => res.status(400).json(err));
  }
);

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.find({})
      .populate("user", ["name", "avatar"])
      .then((profiles) => {
        if (!profiles) {
          errors.profile = "No profiles found";
          return res.status(400).json(errors);
        }
        return res.send(profiles);
      })
      .catch((err) => res.status(400).json(err));
  }
);

//create a new profile or update a profile it already exists
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = profile_validator(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profile_fields = {};

    profile_fields.user = req.user.id;
    if (req.body.handle) profile_fields.handle = req.body.handle;
    if (req.body.company) profile_fields.company = req.body.company;
    if (req.body.location) profile_fields.location = req.body.location;
    if (req.body.website) profile_fields.website = req.body.website;
    if (req.body.bio) profile_fields.bio = req.body.bio;
    if (req.body.status) profile_fields.status = req.body.status;
    if (req.body.githubusername)
      profile_fields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profile_fields.skills = req.body.skills.split(",");
    }

    profile_fields.socials = {};

    if (req.body.youtube) profile_fields.socials.youtube = req.body.youtube;
    if (req.body.instagram)
      profile_fields.socials.instagram = req.body.instagram;
    if (req.body.twitter) profile_fields.socials.twitter = req.body.twitter;
    if (req.body.linkedin) profile_fields.socials.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profile_fields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        Profile.findOne({ handle: req.body.handle }).then((profile) => {
          if (profile) {
            errors.handle = "This handle exists already.";
            return res.status(404).json(errors);
          } else {
            new_profile = new Profile(profile_fields);
            new_profile
              .save()
              .then((profile) => res.json(profile))
              .catch((err) => res.status(400).json(err));
          }
        });
      }
    });
  }
);

//get a profile using handle name

router.get("/handle/:handleid", (req, res) => {
  const handle = req.params.handleid;
  const erros = {};
  Profile.findOne({ handle })
    .populate("user", ["name"])
    .then((profile) => {
      if (!profile) {
        erros.profile = "No profile found with this handle";
        return res.status(400).json(errros);
      }
      res.json(profile);
    })
    .catch((err) => res.status(400).json(err));
});

//get a profile using user ID

router.get("/user/:userid", (req, res) => {
  const userid = req.params.userid;
  const errors = {};
  Profile.findOne({ user: userid })
    .populate("user", ["name"])
    .then((profile) => {
      if (!profile) {
        erros.profile = "No profile found with this handle";
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(400).json(err));
});

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    const { errors, isValid } = experience_validator(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    experience_obj = {};

    for (let val of Object.keys(req.body)) {
      experience_obj[val] = req.body[val];
    }

    const user_id = req.user.id;

    Profile.findOne({ user: user_id })
      .then((profile) => {
        if (!profile) {
          erros.profile = "No profile found for this user";
          return res.status(400).json(errors);
        }

        Profile.findOneAndUpdate(
          { user: user_id },
          { $push: { experience: experience_obj } },
          { new: true, useFindAndModify: false }
        )
          .then((new_profile) => {
            res.json(new_profile);
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  }
);

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = education_validator(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    education_obj = {};

    for (let val of Object.keys(req.body)) {
      education_obj[val] = req.body[val];
    }

    const user_id = req.user.id;

    Profile.findOne({ user: user_id })
      .then((profile) => {
        if (!profile) {
          errors.profile = "No profile found for this user";
          return res.status(400).json(errors);
        }

        Profile.findOneAndUpdate(
          { user: user_id },
          { $push: { education: education_obj } },
          { new: true, useFindAndModify: false }
        )
          .then((new_profile) => {
            console.log(new_profile);
            res.json(new_profile);
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  }
);

router.delete(
  "/education/delete/:education_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let exp_id = req.params.education_id;

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeindex = profile.education
          .map((item) => item._id.toString())
          .indexOf(exp_id);
        profile.education.splice(removeindex, 1);
        profile
          .save()
          .then(() => res.json("success"))
          .catch((err) => res.json(err));
      })
      .catch((err) => res.status(400).json(err));
  }
);

router.delete(
  "/experience/delete/:experience_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let exp_id = req.params.experience_id;
    console.log(exp_id);

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeindex = profile.experience
          .map((item) => item._id.toString())
          .indexOf(exp_id);
        console.log(removeindex);
        profile.experience.splice(removeindex, 1);
        profile
          .save()
          .then(() => res.json("success"))
          .catch((err) => res.json(err));
      })
      .catch((err) => res.status(400).json(err));
  }
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndDelete({ user: req.user.id })
      .then(() => {
        console.log("profile deleted succesfully");
        User.findOneAndDelete({ _id: req.user.id }).then(() =>
          res.json("user deleted successfully!")
        );
      })
      .catch((err) => res.status(400).json(err));
  }
);

module.exports = router;
