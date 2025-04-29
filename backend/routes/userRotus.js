// server/routes/userRoutes.js
const express = require('express');
const { signup } = require('../controllers/usercontroller');
const router = express.Router();

// POST route for user signup
router.post('/signup', signup);

module.exports = router;
