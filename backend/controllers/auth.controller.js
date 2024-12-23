


import prisma from "../models/prismaClient.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
// import { TokenExpiredError } from "jsonwebtoken";




export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email or Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Random profile image
    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        image, // Ensure image is being passed
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

   const token =  generateTokenAndSetCookie(newUser.id, res);

    res.status(201).json({
      success: true,
      user: { 
        id: newUser.id,
        email: newUser.email, 
        username: newUser.username, 
        image: newUser.image 
      },
      token,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      success: true,
      user: { 
        id: user.id, 
        email: user.email,
        username: user.username,
        image: user.image,
        },
        token,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const authCheck = async (req, res) => {
    try {
      console.log("req.user : ", req.user);
      res.status(200).json({ success: true, user: req.user });
    } catch (error) {
      console.log("Error in authCheck controller", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
