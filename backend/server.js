const express = require('express');
const cors = require('cors');
const { initializeDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const spinRoutes = require('./routes/spinRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database on startup
initializeDB();

// Global Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  if (['POST', 'PUT'].includes(req.method)) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  next();
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', spinRoutes);
app.use('/api', userRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.json({ status: 'EduJudol Backend Running', architecture: 'MVC' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
