const mongoose = require("mongoose");
const { SEAT_STATUS, DEFAULT_SEAT_STATUS } = require("../utils");

const seatSchema = new mongoose.Schema({
  seatNo: {
    type: String,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Movie",
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Show",
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: SEAT_STATUS,
    default: DEFAULT_SEAT_STATUS,
  },
  userId: {
    type: String,
    // required: true
  },
}, {
  timestamps: true,
});

const Seats = mongoose.model("Seats", seatSchema);
module.exports = Seats;
