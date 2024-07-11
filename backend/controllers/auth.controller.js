import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateAndSetCookie from "../utils/generateAndSetCookie.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.findOne({ username });
    const isCoorect = await bcrypt.compare(password, newUser?.password || "");
    if (!newUser || !isCoorect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateAndSetCookie(newUser._id, res);

    res.status(200).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "internal server error in login controller" });
  }
};

export const signup = async (req, res) => {
  try {
    // Destructure user data from request body
    const { fullName, username, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "password is short" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashPassword,
    });

    // Generate and send token
    generateAndSetCookie(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
    await newUser.save();
  } catch (error) {
    // Handle error
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error in log out" });
  }
};

export const getMe = async (req, res) => {
  try {
    const newUser = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user: newUser });
  } catch (error) {
    console.log("error in get me controller" + error.message);
    res.status(500).json({ error: "internal server error in log out" });
  }
};
// module.exports = {signup , login , logout}
