const mongoose = require("mongoose");

const cropPredictionSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    cropType: {
        type: String,
        required: true,
        enum: ['rice', 'wheat', 'tomato'],
        lowercase: true
    },
    predictedDiseases: [
        {
            type: String,
            required: true
        }
    ],
    predictionDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("CropDisease", cropPredictionSchema);