const mongoose =require("mongoose");


const SoilHealthSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  Temperature: {
    type: Number,
    required: true
  },
  Humidity: {
    type: Number,
    required: true
  },
  Wind_Speed: {
    type: Number,
    required: true
  },
  Nitrogen: {
    type: Number,
    required: true
  },
  Phosphorous: {
    type: Number,
    required: true
  },
  Potassium: {
    type: Number,
    required: true
  },
  Crop_Type: {
    type: String,
    required: true
  },
  soil_quality: {
    type: Number, 
    required: true
  },
  solution: {
    type: String,
  },
  process:{
    type: String,
  }
},{timestamps:true});

module.exports = mongoose.model("SoilHealth", SoilHealthSchema);
