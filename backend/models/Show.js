const mongoose = require("mongoose");
const { ACTIVE_STATUS, INACTIVE_STATUS } = require("../utils");

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  showStartTime: {
    type: String,
    required: true,
  },
  showEndTime: {
    type: String,
    required: true,
  },
  price: {
    priceRow_a_to_c: {
      type: Number,
      required: true,
    },
    priceRow_d_to_h: {
      type: Number,
      required: true,
    },
    priceRow_i_to_n: {
      type: Number,
      required: true,
    },
  },
  totalSeats: {
    type: Number,
    default: 0,
  },
  reservedSeats: {
    type: Number,
    default: 0,
  },
  bookedSeats: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: [ACTIVE_STATUS, INACTIVE_STATUS],
    default: ACTIVE_STATUS,
  },
}, {
  timestamps: true,
});

const Show = mongoose.model("Show", showSchema);
module.exports = Show;
