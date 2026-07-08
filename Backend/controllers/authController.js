const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const register = async (req, res) => {
  try {
    const {
      name,
      enrollmentNo,
      email,
      password,
      role,
      course,
      branch,
      semester,
      year,
      phone,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      enrollmentNo,
      email,
      password: hashedPassword,
      role,
      course,
      branch,
      semester,
      year,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Login User
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {

      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });

    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  register,
  login,
};