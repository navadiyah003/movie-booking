const express = require("express");
const {
  registerMovie,
  updateMovie,
  getActiveMovie,
  getAllMovies,
  chnageMovieStatus,
  getMovie,
  getAllMoviesTitle,
} = require("../controllers/admin/movie");
const { upload } = require("../middleware/fileUpload");
const { authentication } = require("../middleware/authentication");
const { getMovieReports, getMovieAndShowTimings, getDailyBookingReportOfMovie } = require("../controllers/reports/reports");
const router = express.Router();

//get movie and all shows time
router.get("/movie-shows-timings",getMovieAndShowTimings)

router.get("/daily-booking-reports",getDailyBookingReportOfMovie)
//get all movies
router.get("/", authentication, getAllMovies);
//get all movies title
router.get("/get-all-movie-title", authentication, getAllMoviesTitle);

//get current active movie details11
router.get("/active", getActiveMovie);

//get single movie details
router.get("/:movieId", authentication, getMovie);

// Add Movie
router.post("/", authentication, upload.single("poster"), registerMovie);

// Update movie details
router.put("/:movieId", authentication, upload.single("poster"), updateMovie);

// change  movies status
router.put("/chnageMovieStatus/:movieId", authentication, chnageMovieStatus);

router.get("/total-booking-reports/:movieId",getMovieReports)


module.exports = router;
