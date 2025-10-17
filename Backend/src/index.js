const express = require('express');
const dbconnect = require('./config/database');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require("cors");


// Import routes
const dealerRoutes = require('./routes/dealerRoutes');
const farmerRoutes = require('./routes/farmerRoutes');

const app = express();
const allowedOrigins = [
  "http://localhost:3000",//frontend port
  "http://localhost:5173",
  "http://localhost:5174",
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

// Middleware
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/api/v1/dealer', dealerRoutes);
app.use('/api/v1/farmer', farmerRoutes);

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  return res.json({ success: true, message: 'Your server is up and running ...' });
});

const initializeConnection = async () => {
  try {
    await dbconnect();
    console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server listening at port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}`);
  });
} catch (err) {
    console.error( err && err.message ? err.message : err);
  }
};

initializeConnection();
