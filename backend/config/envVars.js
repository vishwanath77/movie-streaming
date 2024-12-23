import dotenv from 'dotenv';

dotenv.config();

export const ENV_VARS = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
};
