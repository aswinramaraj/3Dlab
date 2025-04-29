// routes/postRoutes.js
const express = require('express');
const multer = require('multer');
const { createPost, getAllPosts } = require('../controllers/postcontroller');
const path = require('path');

// Create an instance of the router
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Route to get all posts
router.get('/', getAllPosts);

// Route to create a new post
router.post('/', upload.single('image'), createPost);

module.exports = router;
