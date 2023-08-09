const express = require("express");
const { authentication } = require("../middleware/authentication");
const { bookMovie, reserveSeats, getShowsByBookingAndUserId, getAdminBookingHistory, changeBookingStatus } = require("../controllers/booking/handelar");

const router = express.Router();

router.post("/book-movie/:movieId", authentication, bookMovie);
router.get("/get-all-bookings/:userId", getAdminBookingHistory)
router.post("/reserve-seats/:movieId", authentication, reserveSeats);
router.get("/:bookingId", authentication, getShowsByBookingAndUserId);
router.put("/chnage-booking-status/:bookingId", authentication, changeBookingStatus)



module.exports = router;
