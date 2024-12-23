// import axios from "axios";
// import { ENV_VARS } from "../config/envVars.js";

// export const fetchFromTMDB = async (url) => {
//   const options = {
//     params: { language: "en-US" },
//     headers: {
//       accept: "application/json",
//       Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY,
//     },
//   };
//   console.log("TMDB_API_KEY:", ENV_VARS.TMDB_API_KEY);

//   const response = await axios.get(url, options);
//   if (response.status !== 200) {
//     throw new Error("Failed to fetch data from TMDB" + response.statusText);
//   }
//   return response.data;
// };
  
              //  prisma + mysql 

import { PrismaClient } from "@prisma/client";
import axios from "axios";
// import { ENV_VARS } from "../config/envVars.js";
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();

import axiosRetry from "axios-retry";

// Apply retry mechanism to Axios
axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error),
  retryDelay: (retryCount) => retryCount * 2000, // Exponential backoff (2 seconds)
});

// Fetch data from TMDB API
export const fetchFromTMDB = async (url) => {
  try {
    const options = {
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      timeout: 10000, // 10 seconds
    };

    const response = await axios.get(url, options);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from TMDB: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching from TMDB:", error.response?.data || error.message);
    throw new Error("Error fetching data from TMDB");
  }
};

// Save movie data to the database
export const saveMovie = async (movieData) => {
  try {
    const movie = await prisma.movie.create({
      data: {
        title: movieData.title,
        overview: movieData.overview,
        releaseDate: new Date(movieData.release_date),
        posterPath: movieData.poster_path
          ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
          : null, // Optional: Build the full URL for the poster
        genreIds: movieData.genre_ids ? JSON.stringify(movieData.genre_ids) : "[]", // Save genreIds as a string (if necessary)
      },
    });
    return movie;
  } catch (error) {
    console.error("Error saving movie to database:", error.message);
    throw new Error("Error saving movie to database");
  }
};

// Retrieve movies from the database
export const getMovies = async () => {
  try {
    const movies = await prisma.movie.findMany();
    return movies;
  } catch (error) {
    console.error("Error fetching movies from database:", error.message);
    throw new Error("Error fetching movies from database");
  }
};
