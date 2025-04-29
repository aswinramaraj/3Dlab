require('dotenv').config();
const express = require('express');    // Add this line to import express
const cors = require('cors');         // Make sure cors is imported
const app = express();                // Initialize express app
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');         // Ensure path is also required

const PORT = process.env.PORT || 5000;

app.use(cors());                      // Enable CORS
app.use(express.json());              // Enable JSON parsing for requests
app.use(express.urlencoded({ extended: true }));  // Enable URL-encoded parsing

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/3D-virtual-lab', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the routes for posts
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
