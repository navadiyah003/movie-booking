const Movie = require("../../models/Movie");
const User = require("../../models/User");
const { ACTIVE_STATUS, ADMIN } = require("../../utils");

exports.registerMovie = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const { title, description, releaseDate, duration, director, language } =
      req.body;
    const posterUrl = req.file?.path;

    const movie = new Movie({
      title,
      description,
      releaseDate,
      duration,
      director,
      language,
      poster: posterUrl,
      createdBy: req.user._id,
    });
    const savedMovie = await movie.save();
    res.status(201).send({
      message: "SUCESSFULLY REGISTERED",
      movie: savedMovie,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register movie.", error: err });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { title, description, releaseDate, duration, director, language } =
      req.body;

    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const posterUrl = req.file?.path;
    let data
    if (posterUrl) {
      data = {
        title,
        description,
        releaseDate,
        duration,
        director,
        language,
        poster: posterUrl,
      }
    } else {
      data = {
        title,
        description,
        releaseDate,
        duration,
        director,
        language,
      }
    }
    // Find the movie by ID
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      data,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ movie, message: "Update Successfull" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update movie details.", error: err });
  }
};

exports.getActiveMovie = async (req, res) => {
  try {
    // Check if the user is an admin
    // if (req.user.role !== ADMIN) {
    //   return res.status(403).json({ message: "Access denied!" });
    // }

    const activeMovies = await Movie.find({ status: ACTIVE_STATUS });
    if (activeMovies.length === 0) {
      return res.status(404).json({
        movie: activeMovies,
        message: "No Active Movie found",
      });
    }
    res.status(200).json({
      movie: activeMovies,
      message: "Successfull",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve active movies." });
  }
};

// Get movie details by ID
exports.getMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Success", movie });
  } catch (err) {
    console.error("ffff", err);
    res
      .status(500)
      .json({ message: "Failed to fetch movie details.", error: err });
  }
};

// Get all movies, with active status first
exports.getAllMovies = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const movies = await Movie.find().sort({ status: 1 });

    res.status(200).json({
      movies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve movies.", error: err });
  }
};

// Update the status of a movie
exports.chnageMovieStatus = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { status } = req.body;

    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }

    // Find the current status of the movie by ID
    const existingMovie = await Movie.findById(movieId);

    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the status in the request is the same as the existing status
    if (status === existingMovie.status) {
      return res
        .status(400)
        .json({
          message:
            "Movie status is already the same, please refresh to get updated data!",
        });
    }

    // Find the movie by ID and update its status
    if (status === ACTIVE_STATUS) {
      const isAnyActiveMovie = await Movie.findOne({ status: ACTIVE_STATUS });
      if (isAnyActiveMovie) {
        return res.status(302).send({
          message:
            "Another Movie is already active, Please deactivate that first.",
        });
      }
    }
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { status },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({
      movie: updatedMovie,
      message: "Success",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update movie status.", error: err });
  }
};
// Get all movies, with active status first
exports.getAllMoviesTitle = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const movies = await Movie.find().populate('title');

    res.status(200).json({
      movies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve movies.", error: err });
  }
};

