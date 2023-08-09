const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../utils");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    seats: { type: [], ref: "Seats" },
    movie: {
      type: String,
      ref: "Movie",

    },
    totalPrice: { type: Number, required: true },
    bookingId: { type: String, required: true },
    status: {
      type: String,
      enum: [BOOKING_STATUS.PENDING, BOOKING_STATUS.BOOKED, BOOKING_STATUS.VISITED,BOOKING_STATUS.CANCEL],
      default: BOOKING_STATUS.BOOKED,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
