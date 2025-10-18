const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  // Dealer Reference
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true,
  },
  
  // Crop Basic Information
  category: {
    type: String,
    enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment', 'Grains', 'Vegetables', 'Fruits', 'Other'],
    required: true,
  },
  
  name: {
    type: String,
    required: true,
    trim: true,
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
    default: 'quintal',
  },
  
  harvestDate: {
    type: Date,
    default: Date.now
  },
  
}, {
  timestamps: true
});

module.exports = mongoose.model("Crop", cropSchema);