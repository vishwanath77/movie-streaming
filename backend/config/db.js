

import { PrismaClient } from '@prisma/client';

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
