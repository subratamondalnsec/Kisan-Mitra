const mongoose =require("mongoose");
const farmerLoanSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    rejectionReason: String,
    // Identity Documents
  documents: {
    aadharNumber: String,
    panNumber: String,
    voterIdNumber: String,
    kccNumber: String, // Kisan Credit Card
    farmLandRecords: [String], // Document URLs
    passportPhoto: String // Photo URL
  },
   farmDetails: {
      landSize: {
        type: Number, // in acres
        required: true
      },
      location: {
        coordinates: {
          longitude: Number,
          latitude: Number
        },
        address: String,
        district: String,
        state: String,
        pincode: String
      },
      soilType: {
        type: String,
        enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain', 'Other']
      },
      irrigationType: {
        type: String,
        enum: ['Drip', 'Sprinkler', 'Flood', 'Rain-fed', 'Mixed']
      },
      waterSource: {
        type: String,
        enum: ['Borewell', 'Canal', 'River', 'Pond', 'Rainwater', 'Mixed']
      },
      currentCrops: [{
        cropName: String,
        variety: String,
        plantingDate: Date,
        expectedHarvestDate: Date,
        area: Number, // in acres
        stage: {
          type: String,
          enum: ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Harvested']
        }
      }],
    },
    
    // Financial Information - Embedded directly
    financialInfo: {
      annualIncome: {
        type: Number,
      },
      bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branchName: String,
        accountType: {
          type: String,
          enum: ['Savings', 'Current', 'Joint']
        }
      },
      existingLoans: [{
        loanType: String,
        amount: Number,
        lender: String,
        interestRate: Number,
        startDate: Date,
        endDate: Date,
        status: {
          type: String,
          enum: ['Active', 'Completed', 'Defaulted']
        }
      }],
      
    },
});

module.exports = mongoose.model("FarmerLoan", farmerLoanSchema);
