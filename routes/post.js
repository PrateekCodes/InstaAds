const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const Auth = require("../auth/auth");
const upload = require("../utils/upload");

// Protect the route

router.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log(err);
    } else {
      if (req.file === undefined) {
        res.json({
          msg: "Error: No file selected"
        });
      } else {
        console.log("File uploaded");
        res.json({
          msg: "File uploaded",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

router.use(Auth.verToken);
// Post request
router.post("/", async (req, res) => {
  // Set request body author
  req.body.author = req.userId;
  try {
    if (!req.body.isImage) {
      if (req.body.media.includes("youtube.com/watch")) {
        req.body.media = req.body.media.split("v=")[1].substring(0, 11);
      } else if (req.body.media.includes("youtu.be")) {
        req.body.media = req.body.media.split("be/")[1].substring(0, 11);
      } else {
        return res
          .status(400)
          .json({ message: "Please enter vaild url", status: false });
      }
    }
    const post = await Post.create(req.body);

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { post: post.id } },
      { safe: true, upsert: true, new: true }
    );

    res
      .status(200)
      .json({ message: "Post created successfully", status: true });
  } catch (error) {
    res.status(400).json({ message: "There's an error", status: false, error });
  }
});

// Get single post
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findOne({ _id: postId }).populate(
      "author",
      "-password"
    );
    if (!post) res.json({ message: "Post doesn't found", status: false });
    res.json({ post });
  } catch (error) {
    res.status(401).json({ message: "There's an error", status: false });
  }
});

// Put the post
router.put("/:postid", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    const user = await User.findById(req.userId);
    // Checks if the post has same author
    if (post.author._id == user.id) {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postid,
        req.body
      );
      res.status(200).json({
        message: "Post updated successfully",
        status: "success"
      });
    } else {
      res.status(401).json({ message: "User not authorized", status: false });
    }
  } catch (error) {
    res.status(400).json({ message: "There's an error", status: false, error });
  }
});

// Delete the post
router.delete("/:postid", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    const user = await User.findById(req.userId);
    // Checks if the post has same author
    if (post.author._id == user.id || user.isAdmin) {
      const deletePost = await Post.findByIdAndDelete(req.params.postid);
      const user = await User.findOneAndUpdate(
        { id: post.author.id },
        { $pull: { post: post.id } },
        { new: true }
      );
      res.status(200).json({
        message: "Post deleted successfully",
        status: "success",
        user
      });
    } else {
      res.status(401).json({ message: "User not authorized", status: false });
    }
  } catch (error) {
    res.status(400).json({ message: "There's an error", status: false, error });
  }
});

// Patch the post { like }
router.patch("/:postid/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    const user = await User.findById(req.userId);

    // Checks if post liked already
    if (post.like.includes(user.id)) {
      return res.json({ message: "Post liked already", status: false });
    } else {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postid,
        { $push: { like: req.userId } },
        { safe: true, upsert: true, new: true }
      );
      res.status(200).json({
        message: "Post updated successfully",
        status: "success",
        post: updatePost
      });
    }
  } catch (error) {
    res.status(400).json({ message: "There's an error", status: false, error });
  }
});

// Patch the post { unlike }
router.patch("/:postid/unlike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    const user = await User.findById(req.userId);

    // Checks if post liked already
    if (post.like.includes(user.id)) {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postid,
        { $pull: { like: req.userId } },
        { safe: true, upsert: true, new: true }
      );
      res.status(200).json({
        message: "Post updated successfully",
        status: true,
        post: updatePost
      });
    } else {
      res.json({
        message: "Post doesn't contain any like from current user",
        status: false
      });
    }
  } catch (error) {
    res.status(400).json({ message: "There's an error", status: false, error });
  }
});

// Patch the post view
router.patch("/:postid/view", async (req, res) => {
  try {
    let post = await Post.findOne({ _id: req.params.postid });
    // Increment the views
    post.views = post.views + 1;
    post = await post.save();
    res.status(200).json({
      message: "Post updated successfully",
      status: true,
      post
    });
  } catch (error) {
    res.status(400).json({ message: "There's an error", status: false, error });
  }
});

module.exports = router;
