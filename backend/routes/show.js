
const express = require("express");
const { registerShowsForMovie, changeShowStatus, reservedShow, updateShowDetails, getShowsByBookingAndUserId, cancelReservedSeats, cancelShowBooking } = require("../controllers/show/handelar");
const { authentication } = require("../middleware/authentication");
const { getShowReports, getShowsAllBookigs,  getReportsOfShowsByMovie, getSeatWiseReport, getAllSeatsReportMovie } = require("../controllers/reports/reports");
const router = express.Router();
//add shows
router.post("/:movieId", authentication, registerShowsForMovie);

//update show
router.put("/:movieId/:showId", authentication, updateShowDetails);

// change  shows status
router.put(
  "/chnageShowStatus/:movieId/:showId",
  authentication,
  changeShowStatus
);

//reserved a show seats
router.post("/reserved/:movieId/:showId", authentication, reservedShow);
//cancel show booking
router.delete("/:bookingId", authentication, cancelShowBooking)
//cancel show reservation
router.delete("/:movieId/:showId/:seatNo", authentication, cancelReservedSeats);

//get show reports
router.get("/reports/:movieId/:showId", authentication, getShowReports)
router.get("/show-info/:showId", authentication, getShowsAllBookigs)
router.get("/daily-booking-reports",getReportsOfShowsByMovie)
router.get("/daily-seat-booking-reports",getAllSeatsReportMovie)

module.exports = router;
