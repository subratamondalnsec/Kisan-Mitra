const mongoose = require('mongoose');
require('dotenv').config();

async function dbconnect() {
  const url = process.env.DB_URL;
  if (!url) {
    throw new Error('DB_URL is not set in environment variables. Please add it to your .env file');
  }

  // use new connection options if needed; mongoose v6+ manages defaults
  try {
    await mongoose.connect(url);
  } catch (err) {
    // rethrow with more context
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }
}

module.exports = dbconnect;