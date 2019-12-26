const express = require("express");
const router = express.Router();

const Auth = require("../auth/auth");
const User = require("../models/user");
const adPost = require("../models/adPost");
const Post = require("../models/post");

// Verify the token
router.use(Auth.verToken);

// Get dashboard
router.get("/dashboard", async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const posts = await Post.find({ isApprove: false }).sort({
        createdAt: -1
      });
      const adPosts = await adPost
        .find({ isApprove: false })
        .sort({ createdAt: -1 });
      return res.json({
        message: "Request success",
        status: true,
        adPosts,
        posts
      });
    } else {
      res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    return res.json({ message: "There's error", status: false, error });
  }
});

// Patch post
router.patch("/post/:postid", async (req, res) => {
  // Checks if the user is admin
  try {
    if (req.user.isAdmin) {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.postid },
        { isApprove: true }
      );
      if (post === null) {
        return res.json({
          message: "Post not found with this post ID",
          status: false
        });
      }
      return res
        .status(200)
        .json({ message: "Post approved successfully", status: "success" });
    } else {
      res.status(401).json({ message: "User not authorized", status: false });
    }
  } catch (error) {
    return res.json({ message: "There's an error", status: false, error });
  }
});

// Patch ad post
router.patch("/adpost/:adpostid", async (req, res) => {
  // Checks if the user is admin
  try {
    if (req.user.isAdmin) {
      const post = await adPost.findOneAndUpdate(
        { _id: req.params.adpostid },
        { isApprove: true }
      );
      if (post === null) {
        return res.json({
          message: "Ad post not found with this post ID",
          status: false
        });
      }
      return res
        .status(200)
        .json({ message: "Ad post approved successfully", status: true });
    } else {
      res.status(401).json({ message: "User not authorized", status: false });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "There's an error", status: false, error });
  }
});

module.exports = router;
