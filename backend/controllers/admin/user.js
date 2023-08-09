const User = require("../../models/User");

exports.register = async (req, res) => {
    try {
      let { name, email, mobile, password, empId, role } = req.body;
      if (role) {
        role = role.toUpperCase();
      }
      const isMobileRegister = await User.find({ mobile });
      const isEmailRegister = await User.find({ email });
      const isUsedEmpId = await User.find({ empId });
  
      if (isUsedEmpId.length > 0) {
        return res.status(201).json({ message: "Employee Id Alredy Registered" });
      } else if (isEmailRegister.length > 0) {
        return res.status(201).json({ message: "Email Alredy Registered" });
      } else if (isMobileRegister.length > 0) {
        return res.status(201).json({ message: "Mobile No Alredy Registered" });
      } else {
        //hash password
        const salt = bcrypt.genSaltSync(5);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
  
        //create new user instance
        let user = new User({
          name,
          email,
          mobile,
          password: hashPassword,
          empId,
        });
        const registerUser = await user.save();
        if (user) {
          res
            .status(200)
            .json({ message: "SUCCESSFULLY REGISTERED", user: registerUser });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: error.message });
    }
  };
  exports.getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find();
      res.status(200).json({users});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch users.", error: error });
    }
  };
  exports.updateUserDetails = async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, mobile, password } = req.body;
  
      // Find the user by ID
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user details if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (mobile) user.mobile = mobile;
  
      if (password) {
        // If password is provided, hash it and update
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password.trim(), salt);
        user.password = hashPassword;
      }
  
      // Save the updated user details
      const updatedUser = await user.save();
  
      res.status(200).json({users:updatedUser});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update user details." });
    }
  };