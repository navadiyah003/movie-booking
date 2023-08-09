const User = require("../../models/User");
const { findUserByCredential, generateAuthToken } = require("../utils");

const Booking = require("../../models/Booking");
const Show = require("../../models/Show");

//login user
exports.login = async (req, res) => {
  try {
    const user = await findUserByCredential(req, res);
    if (!user) return;
    const token = await generateAuthToken(user);
    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, empId: user.empId, mobile: user.email, role: user.role }, token });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: error.message });
  }
};
// Get all booking details for a specific user
exports.getAllBookedMovies = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all booking details for the user with movie titles
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "showtime",
        // select: "movie title", // Specify the fields to be populated from the 'Show' collection
        // populate: {
        //   path: "movie",
        //   select: "title", // Specify the fields to be populated from the 'Movie' collection
        // },
      })
      .populate("movie").sort({ createdAt: -1 })

    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch booking details." });
  }
};
exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by bookingId and populate the related data
    const booking = await Booking.findById(bookingId)
      // .populate("user", "name email empId mobile role")
      .populate("showtime", "")
      .populate("movie", "");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booking details." });
  }
};
