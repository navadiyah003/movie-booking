const express = require("express");
const router = express.Router();
const { login, getBookingDetails } = require("../controllers/user/user");
const { getAllBookedMovies, bookMovie } = require("../controllers/user/user");
const { authentication } = require("../middleware/authentication");
const {
  getAllShowsForMovie,
  getSeatsDetails,
  getShowDetails,
} = require("../controllers/common/handelar");
const { register, getAllUsers, updateUserDetails } = require("../controllers/admin/user");
const { createPdfForTicket } = require("../controllers/pdf/generatePdf");

// login user
router.post("/login", login);

//register a user
router.post("/register", register);
router.get("/", getAllUsers);
router.put("/:userId", updateUserDetails);


router.get(
  "/get-all-seats-details/:movieId/:showId",
  authentication,
  getSeatsDetails
);

router.get(
  "/getAllShowsForMovie/:movieId",
  
  getAllShowsForMovie
);
router.get("/get-all-booked-movie/:userId", authentication, getAllBookedMovies);
router.get("/get-booking-details/:bookingId", authentication, getBookingDetails);

router.get("/getShow/:movieId/:showId", authentication, getShowDetails);
router.post("/ticket",createPdfForTicket)

module.exports = router;
