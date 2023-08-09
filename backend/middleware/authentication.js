const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ADMIN } = require("../utils");
require("dotenv").config();
exports.authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SCERET);

    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error("Please authenticate!");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ Error: "please authenticate!" });
  }
};
exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== ADMIN) {
    return res
      .status(403)
      .json({ message: "Access denied. Only admins can reserve tickets." });
  }
  next();
};
