const mongoose = require("mongoose");
const { STATUS, INACTIVE_STATUS } = require("../utils");
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    releaseDate: {
      type: Date,
      trim: true,
    },
    duration: {
      type: Number,
      trim: true,
    },
    director: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      trim: true,
      require: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: INACTIVE_STATUS,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
