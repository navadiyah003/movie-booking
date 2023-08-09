const Booking = require("../../models/Booking");
const Movie = require("../../models/Movie");
const Seats = require("../../models/Seats");
const Show = require("../../models/Show");
const { ADMIN, TOTAL_SEATS_CAPACITY, RESERVED, BOOKING_STATUS } = require("../../utils");

exports.registerShowsForMovie = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }

    const shows = req.body;
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Register the shows for the movie
    const createdShows = await Promise.all(
      shows.map(async (show) => {
        const { sTime, eTime, price, title } = show;
        // Create the show with the provided details
        const newShow = new Show({
          movie: movieId,
          showStartTime: sTime,
          showEndTime: eTime,
          title,
          price: {
            priceRow_a_to_c: price.priceRow_a_to_c,
            priceRow_d_to_h: price.priceRow_d_to_h,
            priceRow_i_to_n: price.priceRow_i_to_n,
          },
          totalSeats: TOTAL_SEATS_CAPACITY, // Set initial available seats
        });

        // Save the show to the database
        await newShow.save();

        return newShow;
      })
    );

    res.status(201).json({
      message: "Shows registered successfully",
      shows: createdShows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register shows", error: err });
  }
};
exports.updateShowDetails = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }

    const { showId, movieId } = req.params;
    const { sTime, eTime, price, title } = req.body;

    // Find the movie by its ID and check if it has an active status
    const movie = await Movie.findOne({
      _id: movieId,
    });

    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie Not Found!" });
    }

    // Find the show by its ID and check if it belongs to the movie and is active
    const show = await Show.findOne({
      _id: showId,
      movie: movieId,
    });

    if (!show) {
      return res
        .status(404)
        .json({ message: "Show Not Found!" });
    }

    // Update the show with the provided details
    show.showStartTime = sTime || show.showStartTime;
    show.showEndTime = eTime || show.showEndTime;
    show.title = title || show.title;
    show.price = {
      priceRow_a_to_c: price.priceRow_a_to_c || show.price.priceRow_a_to_c,
      priceRow_d_to_h: price.priceRow_d_to_h || show.price.priceRow_d_to_h,
      priceRow_i_to_n: price.priceRow_i_to_n || show.price.priceRow_i_to_n,
    };

    // Save the updated show to the database
    await show.save();

    res.status(200).json({
      message: "Show details updated successfully",
      show: show,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update show details", error: err });
  }
};

// Change status of a show for a movie
exports.changeShowStatus = async (req, res) => {
  try {
    const { movieId, showId } = req.params;
    const { status } = req.body;

    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }
    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the show exists
    const show = await Show.findOne({ movie: movieId, _id: showId });
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Update the show status
    show.status = status;
    const updatedShow = await show.save();

    res
      .status(200)
      .json({ message: "Show status updated successfully", show: updatedShow });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update show status", error: err });
  }
};
// Reserved tickets for a movie
exports.reservedShow = async (req, res) => {
  try {
    const { movieId, showId } = req.params;
    const { userId, seatIds, totalPrice } = req.body;

    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied!" });
    }
    // Check if the user is an admin
    if (req.user.role !== ADMIN) {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can reserve tickets." });
    }

    // Check if the movie exists and is allowed to be booked
    const movie = await Movie.findOne({
      _id: movieId,
      status: ACTIVE_STATUS,
    });
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found or movie is not active!" });
    }

    // Check if the showtime exists and also active
    const showtime = await Show.findOne({
      _id: showId,
      status: ACTIVE_STATUS,
    });
    if (!showtime) {
      return res.status(404).json({
        message: "No a valid showtime or show is not active",
      });
    }

    // Check seat availability
    const unavailableSeats = [];
    const availableSeats = [];

    for (const seatId of seatIds) {
      let seat = await Seats.findOne({
        seatNo: seatId.seatNo,
        movieId,
        showId,
      });

      if (seat && seat.status !== DEFAULT_SEAT_STATUS) {
        unavailableSeats.push(seatId);
      }

      // If the seat doesn't exist, create it and set the initial status to booked
      if (!seat) {
        availableSeats.push({
          seatNo: seatId.seatNo,
          movieId,
          showId,
          status: seatId.status ? seatId.status : RESERVED,
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
      showId,
      { $inc: { reservedSeats: numBookedSeats } },
      { new: true }
    );

    // Create the booking
    const booking = new Booking({
      user: userId,
      showtime: showId,
      seats: seatIds,
      movie: movieId,
      totalPrice,
      status: RESERVED
    });

    // Save the booking to the database
    await booking.save();

    res.status(201).json({
      message: "Movie Successfully Reserved",
      data: booking,
      totalPrice,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to Reserved tickets.", error: err });
  }
};
exports.cancelReservedSeats = async (req, res) => {
  try {
    const { seatNo, movieId, showId } = req.params;

    // Check if the seat exists and is reserved
    const seat = await Seats.findOneAndDelete({
      seatNo,
      movieId,
      showId,
      status: BOOKING_STATUS.RESERVED
    });

    if (!seat) {
      return res.status(404).json({ message: "Seat not found or not reserved" });
    }

    // Update the reservedSeats count in the Show document
    await Show.findByIdAndUpdate(
      showId,
      { $inc: { reservedSeats: -1 } },
      { new: true }
    );
    // Find the corresponding booking and remove the canceled seat from the seats array
    const booking = await Booking.findOneAndUpdate(
      { showtime: showId, movie: movieId },
      { $pull: { seats: { seatNo, movieId, showId } } },
      { new: true }
    );

    // Check if the booking exists and update its status if needed
    if (booking) {
      // If there are no remaining seats in the booking, update the booking status to CANCELED
      if (booking.seats.length === 0) {
        booking.status = CANCELED;
        await booking.save();
      }
    }

    res.status(200).json({ message: "Seat reservation canceled successfully", seat: seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel seat reservation" });
  }
};
exports.cancelShowBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking using bookingId and user ID
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Loop through each seat in the booking and update its status to default (e.g., "AVAILABLE")
    for (const seatId of booking.seats) {
      await Seats.findOneAndDelete(
        {
          seatNo: seatId.seatNo,
          movieId: booking.movie,
          showId: booking.showtime,
          status: BOOKING_STATUS.BOOKED
        },
      );
    }

    // Update the bookedSeats count in the Show document
    const numBookedSeats = booking.seats.length;
    await Show.findByIdAndUpdate(
      booking.showtime,
      { $inc: { bookedSeats: -numBookedSeats } },
      { new: true }
    );

    // Update the booking status to "CANCELED"
    booking.status = BOOKING_STATUS.CANCEL;
    await booking.save();

    res.status(200).json({ message: "Booking successfully canceled", data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel booking", error: err });
  }
};


