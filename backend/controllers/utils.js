const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const generateAuthToken = async function (user) {
  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT_SCERET
  );
  return token;
};
const findUserByCredential = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: userName }, { empId: userName }, { mobile: userName }],
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return false;
  }
  const hashedPassword = await bcrypt.compare(password, user.password);
  if (hashedPassword) {
    return user;
  } else {
    res.status(401).json({ error: "Invalid credentials" });
    return false;
  }
};

module.exports = {
  findUserByCredential,
  generateAuthToken,
};
