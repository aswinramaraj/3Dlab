const Post = require('../models/Post');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username') // Populate author information
      .populate('comments.author', 'username') // Populate comment authors
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, userId, username } = req.body;
    
    const post = new Post({
      title,
      content,
      author: userId,
      username,
      image: req.file ? req.file.path : undefined
    });
    
    const savedPost = await post.save();
    const populatedPost = await savedPost.populate('author', 'username');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    
    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }
    
    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate('author', 'username');
    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const post = await Post.findById(req.params.id);
    
    post.comments.push({ 
      text,
      author: userId
    });
    
    const updatedPost = await post.save();
    const populatedPost = await updatedPost
      .populate('author', 'username')
      .populate('comments.author', 'username');
    res.json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};