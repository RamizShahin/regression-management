require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.cjs');
const { verifyToken } = require('./middleware/auth.cjs');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Get users (protected, only admin and manager can access)
app.get('/api/users', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  // Get users from database and return them
});

// Get projects (protected, only admin and manager can access)
app.get('/api/projects', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  // Get projects from database and return them
});

// Get user settings (protected, but accessible by all authenticated users)
app.get('/api/settings', verifyToken, (req, res) => {
  // Get user settings from database and return them
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 