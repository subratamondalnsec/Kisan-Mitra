const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FirebaseCropImageSchema = new Schema({
  farmerId: { 
    type: String, 
    required: true,
    index: true 
  },
  testName: { 
    type: String, 
    required: true 
  },
  imageKey: { 
    type: String, 
    required: true 
  },
  base64Data: {
    type: String,
    required: false // Optional: store if needed for backup
  },
  cloudinaryUrl: { 
    type: String, 
    required: true 
  },
  cloudinaryPublicId: {
    type: String,
    required: false
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  metadata: {
    cropType: String,
    analysisStatus: {
      type: String,
      enum: ['pending', 'analyzed', 'failed'],
      default: 'pending'
    },
    analysisResult: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create compound index for faster queries
FirebaseCropImageSchema.index({ farmerId: 1, testName: 1 });

module.exports = mongoose.model('FirebaseCropImage', FirebaseCropImageSchema);
