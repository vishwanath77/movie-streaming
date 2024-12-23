

import jwt from "jsonwebtoken";
import prisma from "../models/prismaClient.js";  
//import { ENV_VARS } from "../config/envVars.js";
import dotenv from 'dotenv';
dotenv.config();


export const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the token from the cookies
    const token = req.cookies["jwt-netflix"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No Token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    // Fetch user from the database using Prisma (MySQL)
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId, // decoded.userId is expected to be an integer
      },
      select: {
        id: true,       // Include id
        email: true,    // Include email
        username: true, // Include username
        image: true,    // Include image
      },
    });

    // If no user is found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach the user object to the request for use in subsequent middleware or route handlers
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.log("Error in protect Route Middleware : ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
