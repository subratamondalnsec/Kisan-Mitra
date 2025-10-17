const mongoose =require("mongoose");

const farmerSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true
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
    required: true,
  },
  role:{
    type: String,
    default: 'farmer'
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

export default mongoose.model("Farmer", farmerSchema);
