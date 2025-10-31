const bcrypt = require('bcryptjs');
const Dealer = require('../models/Dealer.js');
const { handleAuthSuccess } = require('../utils/tokenGenerator.js');


exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      FullName,
      lastName,
      email,
      password,
      contactNumber,
      whatsappNumber,
      businessAddress,
    } = req.body;

    // Check if All Details are there or not
    if (!FullName || !lastName || !email || !password || !contactNumber || !whatsappNumber) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required: FullName, lastName, email, password, contactNumber, whatsappNumber",
      });
    }

    // Validate business address required fields
    if (!businessAddress || !businessAddress.businessName || !businessAddress.street || 
        !businessAddress.area || !businessAddress.city || !businessAddress.district || 
        !businessAddress.state || !businessAddress.pincode || !businessAddress.landmark) {
      return res.status(403).json({
        success: false,
        message: "Complete business address is required",
      });
    }

    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ 
      $or: [{ email }, { contactNumber }] 
    });

    if (existingDealer) {
      return res.status(400).json({
        success: false,
        message: "Dealer already exists with this email or contact number. Please sign in to continue.",
      });
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

    if (!phoneRegex.test(whatsappNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit WhatsApp number'
      });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create dealer
    const dealer = await Dealer.create({
      FullName,
      lastName,
      email: email,
      password: hashedPassword,
      contactNumber,
      whatsappNumber,
      businessAddress: {
        businessName: businessAddress.businessName,
        street: businessAddress.street,
        area: businessAddress.area,
        city: businessAddress.city,
        district: businessAddress.district,
        state: businessAddress.state,
        pincode: businessAddress.pincode,
        landmark: businessAddress.landmark,
        coordinates: businessAddress.coordinates || {}
      },
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${FullName}%20${lastName}`
    });

    // Use token generator utility function for response
    return handleAuthSuccess(dealer, res, "Dealer registered successfully");

  } catch (error) {
    console.error('Dealer signup error:', error);
    return res.status(500).json({
      success: false,
      message: "Dealer cannot be registered. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


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

    // Find dealer with provided email or contact number
    const query = email 
      ? { email: email.toLowerCase() }
      : { contactNumber };

    const dealer = await Dealer.findOne(query);

    // If dealer not found
    if (!dealer) {
      return res.status(401).json({
        success: false,
        message: `Dealer is not registered with us. Please sign up to continue`,
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, dealer.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }

    // Use token generator utility function for response
    return handleAuthSuccess(dealer, res, "Dealer logged in successfully");

  } catch (error) {
    console.error('Dealer login error:', error);
    return res.status(500).json({
      success: false,
      message: `Login failure. Please try again`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get dealer profile
exports.getProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.dealer.id).select('-password');

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { dealer }
    });

  } catch (error) {
    console.error('Get dealer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error:  error.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.dealer.id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'FullName', 'lastName', 'contactNumber', 'whatsappNumber', 
      'businessAddress', 'image'
    ];

    // Update only allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        dealer[field] = req.body[field];
      }
    });

    await dealer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        dealer: {
          id: dealer._id,
          FullName: dealer.FullName,
          lastName: dealer.lastName,
          email: dealer.email,
          contactNumber: dealer.contactNumber,
          whatsappNumber: dealer.whatsappNumber,
          businessName: dealer.businessAddress.businessName,
          businessAddress: dealer.businessAddress,
          averageRating: dealer.averageRating,
          isVerified: dealer.isVerified,
          image: dealer.image
        }
      }
    });

  } catch (error) {
    console.error('Update dealer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update dealer preferred language
exports.updatePreferredLanguage = async (req, res) => {
  try {
    const { preferredLanguage } = req.body;

    // Validate language input
    const allowedLanguages = ['Hindi', 'English', 'Bengali'];
    if (!preferredLanguage || !allowedLanguages.includes(preferredLanguage)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid language. Allowed languages: Hindi, English, Bengali'
      });
    }

    const dealer = await Dealer.findById(req.dealer.id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    // Update preferred language
    dealer.preferredLanguage = preferredLanguage;
    await dealer.save();

    res.status(200).json({
      success: true,
      message: `Language updated to ${preferredLanguage} successfully`,
      data: {
        dealer: {
          id: dealer._id,
          FullName: dealer.FullName,
          lastName: dealer.lastName,
          email: dealer.email,
          preferredLanguage: dealer.preferredLanguage,
          image: dealer.image
        }
      }
    });

  } catch (error) {
    console.error('Update dealer language error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get dealer preferred language
exports.getPreferredLanguage = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.dealer.id).select('preferredLanguage FullName lastName email');

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferred language retrieved successfully',
      data: {
        preferredLanguage: dealer.preferredLanguage || 'English',
        dealer: {
          id: dealer._id,
          FullName: dealer.FullName,
          lastName: dealer.lastName,
          email: dealer.email,
          preferredLanguage: dealer.preferredLanguage || 'English'
        }
      }
    });

  } catch (error) {
    console.error('Get dealer language error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};