import Post from "../models/post.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    // Extract the text and image from the request body
    const { text } = req.body;
    let { img } = req.body;

    // Get the user ID from the request and find the user
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // If neither text nor image is provided, return a 400 error
    if (!img && !text) {
      return res.status(400).json({
        error: "Please provide text and image",
      });
    }

    // If an image is provided, upload it to Cloudinary and get the secure URL
    if (img) {
      const result = await cloudinary.uploader.upload(img);
      img = result.secure_url;
    }

    // Create a new Post object with the user ID, text, and image
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    // Save the new post and return it in the response
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    // If an error occurs, return a 500 error and log the error message
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in create post", error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    //
    const postId = req.params.postId;
    console.log(postId);
    //
    const userId = req.user._id.toString();
    //
    const post = await Post.findOne({ _id: postId, user: userId });
    //
    if (!post) {
      return res.status(404).json({
        error: "Post not found or you don't have permission to delete it",
      });
    }
    if (post.img) {
      //delete image
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(post.img);
    }
    //
    await Post.findByIdAndDelete(postId);
    //
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    //
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in delete post", error.message);
  }
};
export const commentOnPost = async (req, res) => {
  try {
    //
    const { text } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id.toString();
    //
    const commet = { user: userId, text };
    const post = await Post.findById(postId);
    //
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    if (!text) {
      return res.status(400).json({
        error: "Please provide text for the comment",
      });
    }
    post.comments.push(commet);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in add comment", error.message);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const userId = req.user._id.toString();

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    console.log(userId);

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
    }
    //
    await post.save();

    const newNotification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await newNotification.save();

    res.status(200).json({
      message: hasLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in like/unlike post", error.message);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in getAllPosts", error.message);
  }
};

export const getLikesPost = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }
    const likesPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    res.status(200).json(likesPosts);
  } catch (error) {
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in getLikesPost", error.message);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const followingPosts = await Post.find({
      user: { $in: user.following },
    })
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");

    res.status(200).json(followingPosts);
  } catch (error) {
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in getFollowingPosts", error.message);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const userPosts = await Post.find({
      user: user._id,
    })
      .populate("user", "username profilePicture")
      .populate("comments.user", "username profilePicture");

    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ "Internal server error": error.message });
    console.log("Error in getUserPosts", error.message);
  }
};
