const express = require("express");
const { ADMIN, RESERVED } = require("../utils");
const Show = require("../../models/Show");
const Booking = require("../../models/Booking");
const Seats = require("../../models/Seats");
const Movie = require("../../models/Movie");
const { ACTIVE_STATUS, BOOKING_STATUS, SEAT_STATUS, DEFAULT_SEAT_STATUS } = require("../../utils");
const { default: mongoose } = require("mongoose");

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== ADMIN) {
        return res.status(403).json({ message: "Access denied!" });
    }
    next();
};

// API endpoint to get total information regarding a movie by its movieId

exports.getMovieReports = async (req, res) => {
    try {
        const { movieId } = req.params;


        // Find the movie by its ID
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Get all shows for the movie
        const shows = await Show.find({ movie: movieId });

        if (shows.length === 0) {
            return res.status(404).json({ message: "No shows found for the movie" });
        }

        // Calculate the total seats capacity for the movie
        const totalSeats = shows.reduce((total, show) => total + show.totalSeats, 0);

        // Calculate the number of booked seats for the movie
        const bookedSeats = await Booking.aggregate([
            { $match: { movie: movieId } },
            { $unwind: "$seats" },
            { $group: { _id: null, bookedSeats: { $sum: 1 } } },
        ]);
        const numBookedSeats = bookedSeats.length > 0 ? bookedSeats[0].bookedSeats : 0;

        // Calculate the number of reserved seats for the movie
        const reservedSeats = await Seats.countDocuments({
            movieId: movieId,
            status: RESERVED,
        });

        // Calculate the total amount collected for the movie
        const bookings = await Booking.find({ movie: movieId });
        const totalAmount = bookings.reduce((total, booking) => total + booking.totalPrice, 0);

        res.status(200).json({
            movie,
            totalSeats: totalSeats,
            bookedSeats: numBookedSeats,
            reservedSeats: reservedSeats,
            totalAmountCollected: totalAmount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch movie information", error: err });
    }
};
// API endpoint to get reports for a specific show of a movie
exports.getShowReports = async (req, res) => {
    try {
        const { movieId, showId } = req.params;

        // Find the movie by its ID
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Find the show by its ID and check if it belongs to the movie
        const show = await Show.findOne({
            _id: showId,
            movie: movieId,
        });

        if (!show) {
            return res.status(404).json({ message: "Show not found or does not belong to the movie" });
        }

        // Calculate the total seats capacity for the show
        const totalSeats = show.totalSeats;

        // Calculate the number of booked seats for the show
        const bookedSeats = await Booking.aggregate([
            { $match: { showtime: showId } },
            { $unwind: "$seats" },
            { $group: { _id: null, bookedSeats: { $sum: 1 } } },
        ]);
        const numBookedSeats = bookedSeats.length > 0 ? bookedSeats[0].bookedSeats : 0;

        // Calculate the number of reserved seats for the show
        const reservedSeats = await Seats.countDocuments({
            showId: showId,
            status: RESERVED,
        });

        // Calculate the total amount collected for the show
        const bookings = await Booking.find({ showtime: showId });
        const totalAmount = bookings.reduce((total, booking) => total + booking.totalPrice, 0);

        res.status(200).json({
            movie: movie,
            show: show,
            totalSeats: totalSeats,
            bookedSeats: numBookedSeats,
            reservedSeats: reservedSeats,
            totalAmountCollected: totalAmount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch show information", error: err });
    }
};


// API endpoint to get all information about a show using showId and retrieve all booking details for that show
exports.getShowsAllBookigs = async (req, res) => {
    try {
        const { showId } = req.params;

        // Find the show by its ID
        const show = await Show.findById(showId);

        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        // Get all bookings for the show
        const bookings = await Booking.find({ showtime: showId }).populate('user').sort({ createdAt: -1 });

        // Combine show, movie, and booking details
        const showInformation = {
            show: show,
            bookings,
        };

        res.status(200).json(showInformation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch show information", error: err });
    }
};

exports.getMovieAndShowTimings = async (req, res) => {
    try {
        // Find all movies with an active status
        const activeMovies = await Movie.find({ status: ACTIVE_STATUS });

        if (activeMovies.length === 0) {
            return res.status(404).json({ message: "No active movies found" });
        }
        const show = await Show.find({ movie: activeMovies[0]?._id })


        res.status(200).json({ movie: activeMovies, show });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch active movies and available shows", error: err });
    }
};


// Get daily booking collection report for a specific movie
exports.getDailyBookingReportOfMovie = async (req, res) => {
    try {
        const { movieId, date } = req.query;

        const matchStage = {
            movie:movieId,
        };

        if (date) {
            const isoDate = new Date(date);
            const nextIsoDate = new Date(isoDate);
            nextIsoDate.setDate(nextIsoDate.getDate()+1)
            matchStage.createdAt = {
                $gte: isoDate,
                $lt: nextIsoDate, // Add one day to the provided date
            };
        }

        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    createdAt: { $first: '$createdAt' },
                    totalAmount: {
                        $sum: {
                            $cond: [
                                { $ne: ['$status', BOOKING_STATUS.CANCEL] },
                                '$totalPrice',
                                0,
                            ],
                        },
                    },
                    totalBookings: { $sum: 1 },
                    totalShows: { $sum: 1 }, // Count the total shows
                },
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    totalAmount: 1,
                    totalBookings: 1,
                    totalShows: 1,
                },
            },
            {
                $sort: { createdAt : -1 },
            },
        ];

        const dailyReports = await Booking.aggregate(pipeline);

        res.json({ dailyReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the daily booking report.' });
    }
};


// Get booking history report for a specific show title
exports.getReportsOfShowsByMovie = async (req, res) => {
    try {
        const { movieId, date, title } = req.query;

        const matchStage = {
            movie: movieId,
        };

        if (title) {
            matchStage['show.title'] = title;
        }

        if (date) {
            const isoDate = new Date(date);
            const formattedDate = isoDate.toISOString().substr(0, 10);
            matchStage.createdAt = {
                $gte: new Date(formattedDate),
                $lt: new Date(formattedDate + 'T23:59:59.999Z'),
            };
        }

        const dailyReports = await Booking.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: 'shows',
                    localField: 'showtime',
                    foreignField: '_id',
                    as: 'show',
                },
            },
            {
                $unwind: '$show',
            },
            {
                $group: {
                    _id: {
                        title: '$show.title',
                        createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    },
                    totalAmount: {
                        $sum: {
                            $cond: [
                                { $ne: ['$status', BOOKING_STATUS.CANCEL] },
                                '$totalPrice',
                                0,
                            ],
                        },
                    },
                    totalBookings: { $sum: 1 },
                    createdAt: { $first: '$createdAt' }, // Include the first createdAt value
                },
            },
            {
                $project: {
                    _id: 0,
                    title: '$_id.title',
                    date: '$_id.createdAt',
                    createdAt: 1, // Include createdAt field
                    totalAmount: 1,
                    totalBookings: 1,
                },
            },
            {
                $sort: { title: 1, date: -1 },
            },
        ]);

        res.json({ dailyReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the daily booking report.' });
    }
};




exports.getAllSeatsReportMovie = async (req, res) => {
    try {
        const { movieId, date } = req.query;

        if (!movieId) {
            return res.status(400).json({ error: 'Missing movieId query parameter' });
        }

        const matchStage = {
            movieId: new mongoose.Types.ObjectId(movieId),
        };

        if (date) {
            const isoDate = new Date(date);
            const nextIsoDate = new Date(isoDate);
            nextIsoDate.setDate(nextIsoDate.getDate() + 1);
            matchStage.createdAt = {
                $gte: isoDate,
                $lt: nextIsoDate, // Add one day to the provided date
            };
        }

        const seatReports = await Seats.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        status: '$status',
                    },
                    count: { $sum: 1 },
                    createdAt: { $first: '$createdAt' }, // Get the first createdAt value
                },
            },
            {
                $group: {
                    _id: '$_id.date',
                    statuses: {
                        $push: {
                            status: '$_id.status',
                            count: '$count',
                        },
                    },
                    createdAt: { $first: '$createdAt' }, // Pass along the createdAt value
                },
            },
            { $sort: { createdAt: -1 } }, // Sort by date ascending
        ]);

        res.json({ seatReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching seat information.' });
    }
};














