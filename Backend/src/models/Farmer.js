const mongoose =require("mongoose");

const farmerSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
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
  role:{
    type: String,
    default: 'farmer'
  },
  image:{
    type: String,
    required: false,
    default: function() {
      return `https://api.dicebear.com/5.x/initials/svg?seed=${this.firstName}%20${this.lastName}`;
    }
  },
  // Address Information
  address: {
    street: String,
    village: String,
    tehsil: String,
    district: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  // Language Preferences
  preferredLanguage: {
    type: String,
    enum: ['Hindi', 'English', 'Bengali'],
    default: 'English'
  },
  

  // Subscription
  subscription: {
    type: String,
    enum:['Free','Premium'],
    default: 'Free'
  },

  creditScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  farmerloan:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmerLoan',
  },
  
   // Verification and Status
  verificationDocuments: {
    addressVerified: {
      type: Boolean,
      default: false
    },
    farmVerified: {
      type: Boolean,
      default: false
    }
  },
  
},{timestamps:true});

module.exports = mongoose.model("Farmer", farmerSchema);
