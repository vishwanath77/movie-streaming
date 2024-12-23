// import { fetchFromTMDB } from "../services/tdmb.service.js";

// export const getTrendingMovies = async (req, res) => {
//   try {
//     const data = await fetchFromTMDB(
//       "https://api.themoviedb.org/3/trending/movie/day"
//     );
//     const randomMovie =
//       data.results[Math.floor(Math.random() * data.results?.length)];

//     res.json({ success: true, content: randomMovie });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server Error in trending movies controller.",
//     });
//   }
// };

// export const getMovieTrailers = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const data = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/movie/${id}/videos`
//     );
//     res.json({ success: true, trailers: data.results });
//   } catch (error) {
//     if (error.message.includes("404")) {
//       return res.status(404).send(null);
//     }
//     res.status(500).json({
//       success: false,
//       message: "Internal server Error in trailer of movies controller.",
//     });
//   }
// };

// export const getMovieDetails = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const data = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/movie/${id}`
//     );
//     res.status(200).json({ success: true, content: data });
//   } catch (error) {
//     if (error.message.includes("404")) {
//       return res.status(404).send(null);
//     }
//     res.status(500).json({
//       success: false,
//       message: "Internal server Error in details of movies controller.",
//     });
//   }
// };

// export const getSimilarMovies = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const data = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/movie/${id}/similar`
//     );
//     res.status(200).json({ success: true, content: data });
//   } catch (error) {
//     if (error.message.includes("404")) {
//       return res.status(404).send(null);
//     }
//     res.status(500).json({
//       success: false,
//       message: "Internal server Error in similar movies controller.",
//     });
//   }
// };

// export const getMoviesByCategory = async (req, res) => {
//   const { category } = req.params;
//   try {
//     const data = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/movie/${category}`
//     );
//     res.status(200).json({ success: true, content: data.results });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message:
//         "Internal server Error in getting movies by category controller.",
//     });
//   }
// };


                  // prisma+mysql


import { fetchFromTMDB, saveMovie, getMovies } from "../services/tdmb.service.js";
import dotenv from 'dotenv';
dotenv.config();

// Controller to get trending movies
export const getTrendingMovies = async (req, res) => {
  try {
    // URL for trending movies
    const url = "https://api.themoviedb.org/3/trending/movie/day";

    // Fetch trending movies from TMDB
    const data = await fetchFromTMDB(url);

    // Validate results
    if (!data || !data.results || data.results.length === 0) {
      return res.status(404).json({ success: false, message: "No trending movies found." });
    }

    // Save movies to database
    const savedMovies = await Promise.all(
      data.results.map(async (movie) => {
        try {
          return await saveMovie(movie);
        } catch (saveError) {
          console.error("Error saving movie:", saveError.message);
          return null;
        }
      })
    );

    // Filter out failed saves
    const successfulMovies = savedMovies.filter(movie => movie !== null);

    if (successfulMovies.length === 0) {
      return res.status(500).json({ success: false, message: "Failed to save movies to the database." });
    }

    // Return a random saved movie
    const randomMovie = successfulMovies[Math.floor(Math.random() * successfulMovies.length)];

    res.json({ success: true, content: randomMovie });
  } catch (error) {
    console.error("Error in trending movies controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in trending movies controller.",
    });
  }
};

// Controller to get movie trailers
export const getMovieTrailers = async (req, res) => {
  const { id } = req.params;
  try {
    // URL for movie trailers
    const url = `https://api.themoviedb.org/3/movie/${id}/videos`;

    // Fetch trailers from TMDB
    const data = await fetchFromTMDB(url);

    if (!data || !data.results) {
      return res.status(404).json({ success: false, message: "No trailers found." });
    }

    res.json({ success: true, trailers: data.results });
  } catch (error) {
    console.error("Error in fetching movie trailers:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching movie trailers.",
    });
  }
};

// Controller to get movie details
export const getMovieDetails = async (req, res) => {
  const { id } = req.params;
  try {
    // URL for movie details
    const url = `https://api.themoviedb.org/3/movie/${id}`;

    // Fetch movie details from TMDB
    const data = await fetchFromTMDB(url);

    if (!data) {
      return res.status(404).json({ success: false, message: "Movie not found." });
    }

    res.status(200).json({ success: true, content: data });
  } catch (error) {
    console.error("Error in fetching movie details:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in movie details controller.",
    });
  }
};

// Controller to get similar movies
export const getSimilarMovies = async (req, res) => {
  const { id } = req.params;
  try {
    // URL for similar movies
    const url = `https://api.themoviedb.org/3/movie/${id}/similar`;

    // Fetch similar movies from TMDB
    const data = await fetchFromTMDB(url);

    if (!data || !data.results) {
      return res.status(404).json({ success: false, message: "No similar movies found." });
    }

    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    console.error("Error in fetching similar movies:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in similar movies controller.",
    });
  }
};

// Controller to get movies by category
export const getMoviesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    // URL for movies by category
    const url = `https://api.themoviedb.org/3/movie/${category}`;

    // Fetch movies by category from TMDB
    const data = await fetchFromTMDB(url);

    if (!data || !data.results) {
      return res.status(404).json({ success: false, message: "No movies found for this category." });
    }

    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    console.error("Error in getting movies by category:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in getting movies by category controller.",
    });
  }
};
