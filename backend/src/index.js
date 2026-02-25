const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  require('fs').appendFileSync('debug.log', `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/fitness', require('./routes/fitnessRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  const errMessage = `[${new Date().toISOString()}] ERROR: ${err.stack || err.message}\n`;
  console.error(errMessage);
  require('fs').appendFileSync('debug.log', errMessage);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
