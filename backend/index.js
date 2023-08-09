const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const morgan = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");
const Users = require("./routes/user");
const Movie = require("./routes/movie");
const Show = require("./routes/show");
const Booking = require("./routes/booking");
cloudinary.config({
  secure: true,
});
require("dotenv").config();

app.use(express.static(__dirname + "/public"));
app.use(express.json({ extended: false }));

app.use(cors())
app.use(morgan("combined"));

// databse url
const DV = process.env.MONGO_URL;
// used port
const port = process.env.PORT || 5000;

// database connection
mongoose
  .connect(DV, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected..");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", Users);
app.use("/api/movie", Movie);
app.use("/api/show", Show);
app.use("/api/booking", Booking);

//error handelar
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        message: "Unexpected file",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        message: "File limite exited",
      });
    }
  }
});

// listen server response
app.listen(port, () => {
  console.log(`SERVER WORKING ON ${port}`);
});
