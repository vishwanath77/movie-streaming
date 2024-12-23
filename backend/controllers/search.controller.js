// import { User } from '../models/user.model.js';
// import { fetchFromTMDB } from '../services/tdmb.service.js';

// export const searchPerson = async (req, res) => {
//   const { query } = req.params;
//   try {
//     const response = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/search/person?query=${query}`
//     );
//     // const response = await fetchFromTMDB(
//     //   `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1`
//     // );
//     if (response.results.length === 0) {
//       return res.status(404).send(null);
//     }
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: {
//         searchHistory: {
//           id: response.results[0].id,
//           image: response.results[0].profile_path,
//           title: response.results[0].name,
//           searchType: 'person',
//           createdAt: new Date(),
//         },
//       },
//     });
//     res.status(200).json({ success: true, content: response.results });
//   } catch (error) {
//     console.log('Error in searchPerson controller : ', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server Error in search Person controller.',
//     });
//   }
// };
// export const searchMovie = async (req, res) => {
//   const { query } = req.params;
//   try {
//     const response = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/search/movie?query=${query}`
//     );
//     if (response.results.length === 0) {
//       return res.status(404).send(null);
//     }
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: {
//         searchHistory: {
//           id: response.results[0].id,
//           image: response.results[0].poster_path,
//           title: response.results[0].title,
//           searchType: 'movie',
//           createdAt: new Date(),
//         },
//       },
//     });
//     res.status(200).json({ success: true, content: response.results });
//   } catch (error) {
//     console.log('Error in searchMovie controller : ', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server Error in search Movie controller.',
//     });
//   }
// };
// export const searchTV = async (req, res) => {
//   const { query } = req.params;
//   try {
//     const response = await fetchFromTMDB(
//       `https://api.themoviedb.org/3/search/tv?query=${query}`
//     );
//     if (response.results.length === 0) {
//       return res.status(404).send(null);
//     }
//     await User.findByIdAndUpdate(req.user._id, {
//       $push: {
//         searchHistory: {
//           id: response.results[0].id,
//           image: response.results[0].poster_path,
//           title: response.results[0].title,
//           searchType: 'tv',
//           createdAt: new Date(),
//         },
//       },
//     });
//     res.status(200).json({ success: true, content: response.results });
//   } catch (error) {
//     console.log('Error in searchTv controller : ', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server Error in search TV controller.',
//     });
//   }
// };
// export const getSearchHistory = async (req, res) => {
//   try {
//     res.status(200).json({ success: true, content: req.user.searchHistory });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Internal server Error in get search History controller.',
//     });
//   }
// };
// export const removeItemFromHistory = async (req, res) => {
//   let { id } = req.params;
//   id = parseInt(id);
//   try {
//     await User.findByIdAndUpdate(req.user._id, {
//       $pull: {
//         searchHistory: { id: id },
//       },
//     });
//     res
//       .status(200)
//       .json({ success: true, message: 'Item removed from search history' });
//   } catch (error) {
//     console.log('Error in removeItemFromHistory controller', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server Error in removeItemFromHistory controller.',
//     });
//   }
// };


                  // prisma and mysql
import { PrismaClient } from '@prisma/client';
import { fetchFromTMDB } from '../services/tdmb.service.js';

const prisma = new PrismaClient();

export const searchPerson = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}`
    );
    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    // Save search history to the User model using Prisma
    await prisma.searchHistory.create({
      data: {
        userId: req.user.id,
        id: response.results[0].id,
        image: response.results[0].profile_path,
        title: response.results[0].name,
        searchType: 'person',
      },
    });

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log('Error in searchPerson controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error in searchPerson controller.',
    });
  }
};

export const searchMovie = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}`
    );
    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    // Save search history to the User model using Prisma
    await prisma.searchHistory.create({
      data: {
        userId: req.user.id,
        id: response.results[0].id,
        image: response.results[0].poster_path,
        title: response.results[0].title,
        searchType: 'movie',
      },
    });

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log('Error in searchMovie controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error in searchMovie controller.',
    });
  }
};

export const searchTV = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}`
    );
    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    // Save search history to the User model using Prisma
    await prisma.searchHistory.create({
      data: {
        userId: req.user.id,
        id: response.results[0].id,
        image: response.results[0].poster_path,
        title: response.results[0].name,
        searchType: 'tv',
      },
    });

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log('Error in searchTV controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error in searchTV controller.',
    });
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    const searchHistory = await prisma.searchHistory.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({ success: true, content: searchHistory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error in getSearchHistory controller.',
    });
  }
};

export const removeItemFromHistory = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id); // Convert string to integer for the movie/person/tv ID
  try {
    await prisma.searchHistory.deleteMany({
      where: {
        userId: req.user.id,
        id: id,
      },
    });
    res.status(200).json({ success: true, message: 'Item removed from search history' });
  } catch (error) {
    console.log('Error in removeItemFromHistory controller:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error in removeItemFromHistory controller.',
    });
  }
};
