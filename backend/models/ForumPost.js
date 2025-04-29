const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const commentSchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  replies: [replySchema]
});

const forumPostSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
