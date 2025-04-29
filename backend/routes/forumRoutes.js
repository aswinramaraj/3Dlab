const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    addComment,
    likePost,
    likeComment,
    replyToComment
  } = require('../controllers/forumController');
  
// Create a new forum post
router.post('/', createPost);

// Get all forum posts
router.get('/', getAllPosts);

// Add comment to a specific post
router.post('/:postId/comments', addComment);

// Like a post
router.post('/:postId/like', likePost);

// Like a comment
router.post('/:postId/comments/:commentId/like', likeComment);

// Reply to a comment
router.post('/:postId/comments/:commentId/reply', replyToComment); 

module.exports = router;
