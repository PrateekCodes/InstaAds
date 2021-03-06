const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    description: { type: String, required: true },
    media: String,
    isImage: { type: Boolean, default: true },
    location: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    isApprove: { type: Boolean, default: false },
    like: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Create post instace
const Post = mongoose.model("Post", postSchema);

// Export the post model
module.exports = Post;
