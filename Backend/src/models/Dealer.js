import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'dealer'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  whatsappNumber:{
    type: String,
    required: true
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

  // Crops/Products Available
  crops: [{
    category: {
      type: String,
      enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Grains', 'Vegetables', 'Fruits', 'Other'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    minQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    maxQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: [ 'quintal'],
      required: true
    },
    harvestDate: Date,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],

  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },


},{timestamps: true});

export default mongoose.model("Dealer", dealerSchema);
