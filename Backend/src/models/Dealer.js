const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema({
  // Basic Information
  FullName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'dealer'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(phone) {
        return /^[6-9]\d{9}$/.test(phone);
      },
      message: 'Please provide a valid 10-digit contact number'
    }
  },
  whatsappNumber:{
    type: String,
    required: true,
    validate: {
      validator: function(phone) {
        return /^[6-9]\d{9}$/.test(phone);
      },
      message: 'Please provide a valid 10-digit WhatsApp number'
    }
  },
  
  // Profile Image
  image: {
    type: String,
    default: `https://api.dicebear.com/5.x/initials/svg?seed=${this.FullName}%20${this.lastName}`
  },
  
  // Business Address
  businessAddress: {
    businessName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    landmark: {
      type: String,
      required: true
    },
    coordinates: {
      longitude: Number,
      latitude: Number
    }
  },
  
  // Identity Documents
  documents: {
    aadhaarNumber: String,
    panNumber: String,
    voterIdNumber: String,
    drivingLicense: String,
    businessDocuments: [String], // Document URLs
    profilePhoto: String // Photo URL
  },
  
  // Language Preferences
  preferredLanguage: {
    type: String,
    enum: ['Hindi', 'English', 'Bengali'],
    default: 'English'
  },
  
  // Average Rating
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Ratings and Reviews (Array to store multiple reviews)
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Crops/Products References (ObjectIDs to separate Crop collection)
  crops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  }],
  

  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },


},{timestamps: true});

module.exports = mongoose.model("Dealer", dealerSchema);
