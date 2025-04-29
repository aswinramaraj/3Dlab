// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // hashed
  role: { type: String, enum: ['teacher', 'student'], required: true }
});

module.exports = mongoose.model('User', userSchema);
