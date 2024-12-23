import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt-netflix", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: true,
    
    
  });
  return token;
};
console.log("token",generateTokenAndSetCookie);


