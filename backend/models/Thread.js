// models/Thread.js
const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  replies: [{
    content: String,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thread', threadSchema);
