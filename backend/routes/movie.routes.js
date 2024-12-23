// import express from "express";
// import {
//   getMovieDetails,
//   getMoviesByCategory,
//   getMovieTrailers,
//   getSimilarMovies,
//   getTrendingMovies,
// } from "../controllers/movie.controller.js";

// const router = express.Router();

// router.get("/trending", getTrendingMovies);
// router.get("/:id/trailers", getMovieTrailers);
// router.get("/:id/details", getMovieDetails);
// router.get("/:id/similar", getSimilarMovies);
// router.get("/:category", getMoviesByCategory);

// export default router;


import express from "express";
import {
  getMovieDetails,
  getMoviesByCategory,
  getMovieTrailers,
  getSimilarMovies,
  getTrendingMovies,
} from "../controllers/movie.controller.js";

const router = express.Router();

// Get trending movies
router.get("/trending", getTrendingMovies);

// Get movie trailers by ID
router.get("/:id/trailers", getMovieTrailers);

// Get movie details by ID
router.get("/:id/details", getMovieDetails);

// Get similar movies by movie ID
router.get("/:id/similar", getSimilarMovies);

// Get movies by category (e.g., popular, top-rated, etc.)
router.get("/category/:category", getMoviesByCategory); // Fix: Changed route to be more specific for categories

export default router;
