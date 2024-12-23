// import mongoose from "mongoose";
// import { ENV_VARS } from "./envVars.js";

// export const connectDB = async () => {
//   try {
//     const connect = await mongoose.connect(ENV_VARS.MONGO_URI);
//     console.log("MongoDB connected : " + connect.connection.host);
//   } catch (error) {
//     console.error("Error connecting to MONGODB : " + error.message);
//     process.exit(1); // 1 means there was an error
//   }
// };
 
                          // prisma orm and mysql

import { PrismaClient } from '@prisma/client';
import { ENV_VARS } from './envVars.js'; // Assuming your ENV_VARS contains the DATABASE_URL

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    // This will automatically establish the connection to MySQL
    await prisma.$connect();
    console.log("MySQL connected successfully!");
  } catch (error) {
    console.error("Error connecting to MySQL: " + error.message);
    process.exit(1); // Exit if there's an error connecting to the database
  }
};
