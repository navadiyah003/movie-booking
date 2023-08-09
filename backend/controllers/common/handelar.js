const Movie = require("../../models/Movie");
const Seats = require("../../models/Seats");
const Show = require("../../models/Show");

// Get all shows for a movie
exports.getAllShowsForMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Find the movie by its ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Find all shows for the movie
    const shows = await Show.find({ movie: movieId });

    res.status(200).json({ shows, message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve shows", error: err });
  }
};

// Get seat availability details for a specific movie and showtime
exports.getSeatsDetails = async (req, res) => {
  try {
    const { movieId, showId } = req.params;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Get seat availability details
    const seats = await Seats.find({
      movieId: movieId,
      showId: showId,
    });

    // Calculate seat counts
    const totalSeats = seats.length;

    res.status(200).json({
      totalSeats,
      seats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch seat details." });
  }
};
exports.getShowDetails = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findById(showId).populate("movie", "title");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({ show });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get show details" });
  }
};
