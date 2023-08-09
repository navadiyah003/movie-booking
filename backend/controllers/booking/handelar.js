const { generateCustomID } = require('../../helper/idGenerator');
const Booking = require("../../models/Booking");
const Movie = require("../../models/Movie");
const Seats = require("../../models/Seats");
const Show = require("../../models/Show");
const User = require("../../models/User");
const { ACTIVE_STATUS, BOOKED, BOOKING_STATUS, RESERVED, DEFAULT_SEAT_STATUS } = require("../../utils");

// Book tickets for a movie
exports.bookMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { userId, showtimeId, seatIds, totalPrice } = req.body;

    // Check if the user Id exists
    if (!userId) {
      return res
        .status(404)
        .json({ message: "User not valid" });
    }

    // Check if the movie exists and is allowed to be booked
    const movie = await Movie.findOne({
      _id: movieId,
      status: ACTIVE_STATUS,
    });
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found or Movie is not allowed to book!" });
    }

    // Check if the showtime exists and also active
    const showtime = await Show.findOne({
      _id: showtimeId,
      status: ACTIVE_STATUS,
    });
    if (!showtime) {
      return res
        .status(404)
        .json({ message: "No a valid showtime or show is not active" });
    }

    // Check seat availability
    const unavailableSeats = [];
    const availableSeats = [];

    for (const seatId of seatIds) {
      let seat = await Seats.findOne({
        seatNo: seatId.seatNo,
        movieId,
        showId: showtimeId,
        userId
      });

      if (seat && seat.status !== DEFAULT_SEAT_STATUS) {
        unavailableSeats.push(seatId);
      }

      // If the seat doesn't exist, create it and set the initial status to booked
      if (!seat) {
        availableSeats.push({
          seatNo: seatId.seatNo,
          movieId,
          showId: showtimeId,
          status: seatId.status ? seatId.status : BOOKED,
          price: seatId.price,
        });
        continue; // Skip adding newly created seats to the unavailableSeats array
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: "Some seats are already booked or reserved",
        unavailableSeats,
      });
    }

    await Seats.insertMany(availableSeats);

    // Update bookedSeats count in the Show document
    const numBookedSeats = seatIds.length;
    await Show.findByIdAndUpdate(
      showtimeId,
      { $inc: { bookedSeats: numBookedSeats } },
      { new: true }
    );


    // Create the booking
    const booking = new Booking({
      user: userId,
      showtime: showtimeId,
      seats: seatIds,
      totalPrice,
      movie: movieId,
      bookingId: generateCustomID(),
      status: BOOKING_STATUS.BOOKED,
    });

    // Save the booking to the database
    await booking.save();

    res.status(201).json({
      message: "Movie Successfully Booked",
      data: booking,
      totalPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to book tickets." });
  }
};

// Reserve Seats for movie by Admin
exports.reserveSeats = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { showtimeId, seatIds, totalPrice, userId } = req.body;

    // Check if the movie exists and is allowed to be reserved
    const movie = await Movie.findOne({
      _id: movieId,
      status: ACTIVE_STATUS,
    });
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found or Movie is not allowed to book!" });
    }

    // Check if the showtime exists and also active
    const showtime = await Show.findOne({
      _id: showtimeId,
      status: ACTIVE_STATUS,
    });
    if (!showtime) {
      return res
        .status(404)
        .json({ message: "Not a valid showtime or show is not active" });
    }

    // Check seat availability
    const unavailableSeats = [];
    const availableSeats = [];

    for (const seatId of seatIds) {
      let seat = await Seats.findOne({
        seatNo: seatId.seatNo,
        movieId,
        showId: showtimeId,
        userId: userId
      });

      if (seat && seat.status !== AVAILABLE) {
        unavailableSeats.push(seatId);
      }

      // If the seat doesn't exist, create it and set the initial status to reserved
      if (!seat) {
        availableSeats.push({
          seatNo: seatId.seatNo,
          movieId,
          showId: showtimeId,
          status: seatId.status ? seatId.status : RESERVED,
          price: seatId.price,
        });
        continue; // Skip adding newly created seats to the unavailableSeats array
      }
    }

    if (unavailableSeats.length > 0) {
      res.status(400).json({
        message: "Some seats are already booked or reserved",
        unavailableSeats,
      });
    }

    await Seats.insertMany(availableSeats);

    // Update reserveSeats count in the Show document
    const numBookedSeats = seatIds.length;
    await Show.findByIdAndUpdate(
      showtimeId,
      { $inc: { reservedSeats: numBookedSeats } },
      { new: true }
    );

    res.status(201).json({
      message: "Seats Successfully Reserved",
      totalPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed Reserve Seat." });
  }
}
exports.getShowsByBookingAndUserId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if the booking exists and belongs to the specified user
    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found or does not belong to the user." });
    }

    // Fetch all shows related to the booking
    const shows = await Show.find({ _id: booking.showtime });

    res.status(200).json({ shows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get shows for the booking and user." });
  }
};
exports.getAdminBookingHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const bookings = await Booking.find({ user: userId }).populate('showtime', "showStartTime").populate('movie', 'title releaseDate language status poster createdAt').sort({ createAt: -1 });
    const reservedSeats = await Seats.find({ status: "RESERVED" }).populate('movieId').populate("showId");

    res.json({ bookings, reservedSeats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching admin data." });
  }
};
// Change booking status by booking ID
exports.changeBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { newStatus } = req.body;
    // Validate newStatus against the allowed booking statuses
    if (!Object.values(BOOKING_STATUS).includes(newStatus)) {
      return res.status(400).json({ error: "Invalid booking status." });
    }

    const updatedBooking = await Booking.findOneAndUpdate({ bookingId }, { status: newStatus }, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).send(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating booking status." });
  }
};