// import { User } from "../models/user.model.js";
// import { generateTokenAnsSetCookie } from "../utils/generateToken.js";
// import bcryptjs from "bcryptjs";


// export const signup = async (req, res) => {
//   try {
//     const { email, password, username } = req.body;
//     if (!email || !password || !username) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required" });
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }
   
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ error: "Password must be at least 6 characters long" });
//     }
//     const existingUserByEmail = await User.findOne({ email: email });
//     if (existingUserByEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "This email account already has an account",
//       });
//     }
//     const existingUserByUsername = await User.findOne({ username: username });
//     if (existingUserByUsername) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Username already taken" });
//     }
//     //hash password (crypting)
//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(password, salt);

//     const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
//     const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       username,
//       image,
//     });

//     generateTokenAnsSetCookie(newUser._id, res);
//     await newUser.save();

//     res.status(201).json({
//       success: true,
//       user: {
//         ...newUser._doc,
//         password: "",
//       },
//     });
//   } catch (error) {
//     console.log("Error in signup controller", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required" });
//     }
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Invalid credentials" });
//     }
//     const isPasswordCorrect = await bcryptjs.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }
//     generateTokenAnsSetCookie(user._id, res);
//     res.status(200).json({
//       success: true,
//       user: {
//         ...user._doc,
//         password: "",
//       },
//     });
//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("jwt-netflix");
//     res.status(200).json({ success: true, message: "Logged out successfully" });
//   } catch (error) {
//     console.log("Error in logout controller", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const authCheck = async (req, res) => {
//   try {
//     console.log("req.user : ", req.user);
//     res.status(200).json({ success: true, user: req.user });
//   } catch (error) {
//     console.log("Error in authCheck controller", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


// using prisma orm 


import prisma from "../models/prismaClient.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// export const signup = async (req, res) => {
//   try {
//     const { email, password, username } = req.body;

//     if (!email || !password || !username) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ success: false, message: "Invalid email format" });
//     }

//     // Check password length
//     if (password.length < 6) {
//       return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
//     }

//     // Check for existing user
//     const existingUser = await prisma.user.findFirst({
//       where: { OR: [{ email }, { username }] },
//     });

//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email or Username already taken" });
//     }

//     // Hash password
//     const hashedPassword = await bcryptjs.hash(password, 10);

//     // Random profile image
//     const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
//     const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

//     // Create user
//     const newUser = await prisma.user.create({
//       data: { email, password: hashedPassword, username, image },
//     });

//     generateTokenAndSetCookie(newUser.id, res);

//     res.status(201).json({
//       success: true,
//       user: { id: newUser.id, email: newUser.email, username: newUser.username, image },
//     });
//   } catch (error) {
//     console.error("Error in signup controller:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


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

    generateTokenAndSetCookie(newUser.id, res);

    res.status(201).json({
      success: true,
      user: { id: newUser.id, email: newUser.email, username: newUser.username, image: newUser.image },
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

    generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      success: true,
      user: { id: user.id, email: user.email, username: user.username, image: user.image },
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
