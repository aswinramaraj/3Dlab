const ForumPost = require('../models/ForumPost');

// Create a post
exports.createPost = async (req, res) => {
  try {
    const newPost = new ForumPost(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err });
  }
};

// Comment on a post
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  try {
    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author, content });
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err });
  }
};

exports.likePost = async (req, res) => {
    try {
      const post = await ForumPost.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      post.likes += 1;
      await post.save();
      res.json({ likes: post.likes });
    } catch (err) {
      res.status(500).json({ message: 'Failed to like post', error: err });
    }
  };
  
  exports.likeComment = async (req, res) => {
    const { postId, commentId } = req.params;
  
    try {
      const post = await ForumPost.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
  
      comment.likes += 1;
      await post.save();
  
      res.json({ likes: comment.likes });
    } catch (err) {
      res.status(500).json({ message: 'Failed to like comment', error: err });
    }
  };

  exports.replyToComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { author, content } = req.body;
  
    try {
      const post = await ForumPost.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
  
      comment.replies.push({ author, content });
      await post.save();
  
      res.json(comment.replies);
    } catch (err) {
      res.status(500).json({ message: 'Failed to reply to comment', error: err });
    }
  };
  