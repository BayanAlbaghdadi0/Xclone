import User from "../models/user.model.js";
import Notification from "../models/notification.js";

import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// import generateAndSetCookie from "../utils/generateAndSetCookie.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserprofile", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const folloUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userTomodify = await User.findById(id);
    const cuerrentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "you can't follow/unfollow yourself" });
    }

    if (!userTomodify || !cuerrentUser) {
      return res.status(404).json({ error: "user not found" });
    }

    const isFollowing = cuerrentUser.following.includes(id);
    if (isFollowing) {
      //Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      //todo #1 : return the id of the user  as a response

      res.status(200).json({ message: "user unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //send notification to user
      const notification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userTomodify._id,
      });
      await notification.save();
      //todo : return the id of the user  as a response
    }
  } catch (error) {
    console.log("Error in folloUnfollowUser", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    // Get the current user id
    const userId = req.user._id;
    // Get the users that the current user is following
    const userFolowedByMe = await User.findById(req.user._id).select(
      "following"
    );
    // Get a random sample of 10 users, excluding the current user
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      { $sample: { $size: 10 } },
    ]);
    // Filter out the users that the current user is already following
    const filteredUsers = users.filter(
      (user) => !userFolowedByMe.following.includes(user._id)
    );
    // Return the first 4 suggested users
    const suggestedUsers = filteredUsers.slice(0, 4);
    // Remove the password field from each suggested user
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, username, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "please provide current password and new password" });
    }
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "password is short" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashPassword;
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedRes = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedRes.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedRes = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedRes.secure_url;
    }
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user = await user.save();
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser", error.message);
    res.status(500).json({ error: error.message });
  }
};
