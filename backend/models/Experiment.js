// models/Experiment.js
const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema({
  title: String,
  subject: String,
  description: String,
  link: String, // to Unreal Engine executable or iframe link
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Experiment', experimentSchema);
