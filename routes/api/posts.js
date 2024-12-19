const express = require("express");
const passport = require("passport");
const Profile = require("./../../models/Profile.js");
const Post = require("./../../models/Post.js");
const post_validator = require("./../../validators/post_validator.js");
const router = express.Router();

router.get("/", (req, res) => {
  Post.find({})
    .then((posts) => {
      if (posts.length === 0) {
        return res.status(400).json("no posts found");
      }
      return res.json(posts);
    })
    .catch((err) => res.status(400).json(err.message));
});

router.get(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then((post) => {
        if (post.length === 0) {
          return res.status(400).json({ err: "no post found" });
        }
        return res.json(post);
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = post_validator(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    let new_post = new Post({
      text: req.body.text,
      user: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar ? req.user.avatar : "",
    });

    new_post
      .save()
      .then((post) => {
        if (!post) {
          res.status(400).json("error occured");
        }
        res.json(post);
      })
      .catch((err) => res.status(400).json(err));
  }
);

router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then((post) => {
        console.log(post.text);
        console.log(req.user.id);
        console.log(post.user.toString());
        if (!(req.user.id === post.user.toString())) {
          return res.status(401).json("User not allowed");
        }

        Post.findOneAndDelete({ _id: req.params.post_id })
          .then(() => res.status(200).json("post deleted succesfully"))
          .catch((err) => res.status(400).json(err.message));
      })
      .catch((err) => res.status(400).json(err.message));
  }
);

router.post(
  "/like/:postid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user.id);
    Post.findOne({ _id: req.params.postid })
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res.status(400).json("You already liked the post.");
        }
        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(() => res.json("success !post is liked"))
          .catch((err) => res.json(err.message));
      })
      .catch((err) => res.status(400).json(err.message));
  }
);

router.post(
  "/unlike/:postid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.postid })
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length == 0
        ) {
          return res.status(400).json("please like the post to dislike.");
        }

        remove_index = post.likes.map((item) => item._id).indexOf(req.user.id);
        post.likes.splice(remove_index, 1);
        post
          .save()
          .then(() => res.json("success !post is disliked"))
          .catch((err) => res.json(err.message));
      })
      .catch((err) => res.status(400).json(err.message));
  }
);

router.post(
  "/:postid/addcomment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = post_validator(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    let new_comment = {
      text: req.body.text,
      user: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar ? req.user.avatar : "",
    };

    Post.findOne({ _id: req.params.postid })
      .then((post) => {
        post.comments.unshift(new_comment);
        post
          .save()
          .then((updatedpost) => res.json(updatedpost))
          .catch((err) => res.json(err.message));
      })

      .catch((err) => res.json(err.message));
  }
);

router.delete(
  "/:post_id/comment/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.post_id })
      .then((post) => {
        comment = post.comments.filter(
          (comment) => comment._id.toString() === req.params.comment_id
        );
        let is_valid = false;
        if (comment[0].user.toString() === req.user.id) {
          is_valid = true;
        }

        if (!(req.user.id === post.user.toString()) && is_valid) {
          return res.status(401).json("User not allowed");
        }

        let remove_index = post.comments
          .map((comment) => comment._id)
          .indexOf(req.params.comment_id);
        post.comments.splice(remove_index, 1);
        post
          .save()
          .then((updatedpost) => res.json(updatedpost))
          .catch((err) => res.json(err.message));
      })
      .catch((err) => res.status(400).json(err.message));
  }
);

module.exports = router;
