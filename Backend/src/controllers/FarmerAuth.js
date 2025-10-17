const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const { handleAuthSuccess } = require('../utils/tokenGenerator');
require('dotenv').config();
// Farmer Registration

exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber
    } = req.body
    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !contactNumber
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required: firstName, lastName, email, password, contactNumber",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit contact number'
      });
    }

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ 
      $or: [{ email }, { contactNumber }] 
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: "Farmer already exists with this email or contact number. Please sign in to continue.",
      })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const farmer = await Farmer.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    })

    // token generation, Farmer object transformation, and response
    handleAuthSuccess(farmer, res, "Farmer registered successfully");

  } catch (error) {
    console.error('Farmer signup error:', error)
    return res.status(500).json({
      success: false,
      message: "Farmer cannot be registered. Please try again.",
      error: error.message
    })
  }
}

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email/contactNumber and password from request body
    const { email, contactNumber, password } = req.body;
    
    console.log("Login request body:", req.body);

    // Check if email/contactNumber or password is missing
    if (!password || (!email && !contactNumber)) {
      return res.status(400).json({
        success: false,
        message: `Please provide email/contact number and password`,
      });
    }

    // Find farmer with provided email or contact number
    const query = email 
      ? { email: email.toLowerCase() }
      : { contactNumber };

    const farmer = await Farmer.findOne(query);

    // If farmer not found with provided email
    if (!farmer) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `Farmer is not registered with us. Please sign up to continue`,
      })
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, farmer.password)) {
        // token generation, Farmer object transformation, and response
        return handleAuthSuccess(farmer, res, "Farmer logged in successfully");
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error('Farmer login error:', error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login failure. Please try again`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get farmer profile
exports.getProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmer.id).select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { farmer }
    });

  } catch (error) {
    console.error('Get farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update farmer profile
exports.updateProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmer.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'firstName', 'lastName', 'contactNumber', 'address'
    ];

    // Update only allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        farmer[field] = req.body[field];
      }
    });

    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        farmer: {
          id: farmer._id,
          firstName: farmer.firstName,
          lastName: farmer.lastName,
          email: farmer.email,
          contactNumber: farmer.contactNumber,
          address: farmer.address
        }
      }
    });

  } catch (error) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

