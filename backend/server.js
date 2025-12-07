require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
// }));
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   process.env.FRONTEND_URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.includes(".vercel.app") ||   // ✅ allow all Vercel preview URLs
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lead Intelligence Platform API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
