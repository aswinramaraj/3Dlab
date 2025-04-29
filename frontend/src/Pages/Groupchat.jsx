import React, { useState, useEffect } from 'react';
import '../cssfile/group.css'; // Adjust the path as necessary

// API Base URL (Replace with your backend URL)
const API_URL = 'http://localhost:5000/api/posts';

// Post Component
const Post = ({ post, onLike, onComment, onLikeComment, onReply }) => {
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState({});

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    await onComment(post._id, { author: 'User', content: commentContent });
    setCommentContent('');
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyContent.trim()) return;
    await onReply(post._id, commentId, { author: 'User', content: replyContent });
    setReplyContent('');
    setShowReplyInput({ ...showReplyInput, [commentId]: false });
  };

  return (
    <div className="post-container">
      <h2 className="post-title">{post.title}</h2>
      <p className="post-meta">By {post.author} • {new Date(post.createdAt).toLocaleString()}</p>
      <p className="post-content">{post.content}</p>
      <div className="post-actions">
        <button
          onClick={() => onLike(post._id)}
          className="like-button"
        >
          <svg className="like-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V16M20 8V16M12 4V20M8 12H16" />
          </svg>
          {post.likes} Likes
        </button>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button
            type="submit"
            className="comment-submit"
          >
            Comment
          </button>
        </form>

        {post.comments.map((comment) => (
          <div key={comment._id} className="comment-container">
            <p className="comment-meta">
              <strong>{comment.author}</strong> • {new Date(comment.createdAt).toLocaleString()}
            </p>
            <p className="comment-content">{comment.content}</p>
            <div className="comment-actions">
              <button
                onClick={() => onLikeComment(post._id, comment._id)}
                className="like-comment-button"
              >
                <svg className="like-icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V16M20 8V16M12 4V20M8 12H16" />
                </svg>
                {comment.likes} Likes
              </button>
              <button
                onClick={() => setShowReplyInput({ ...showReplyInput, [comment._id]: !showReplyInput[comment._id] })}
                className="reply-button"
              >
                Reply
              </button>
            </div>

            {/* Reply Input */}
            {showReplyInput[comment._id] && (
              <div className="reply-form">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Add a reply..."
                  className="reply-input"
                />
                <button
                  onClick={() => handleReplySubmit(comment._id)}
                  className="reply-submit"
                >
                  Reply
                </button>
              </div>
            )}

            {/* Replies */}
            {comment.replies.map((reply) => (
              <div key={reply._id} className="reply-container">
                <p className="reply-meta">
                  <strong>{reply.author}</strong> • {new Date(reply.createdAt).toLocaleString()}
                </p>
                <p className="reply-content">{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Create Post Form Component
const CreatePostForm = ({ onPostCreated }) => {
  const [postData, setPostData] = useState({ title: '', content: '', author: 'User' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.content.trim()) return;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (response.ok) {
      const newPost = await response.json();
      onPostCreated(newPost);
      setPostData({ title: '', content: '', author: 'User' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h2 className="create-post-title">Create a New Post</h2>
      <input
        type="text"
        value={postData.title}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        placeholder="Post Title"
        className="post-title-input"
      />
      <textarea
        value={postData.content}
        onChange={(e) => setPostData({ ...postData, content: e.target.value })}
        placeholder="Post Content"
        className="post-content-input"
      />
      <button
        type="submit"
        className="create-post-submit"
      >
        Create Post
      </button>
    </form>
  );
};

// Main Chat Component
const Chat = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId) => {
    const response = await fetch(`${API_URL}/${postId}/like`, { method: 'POST' });
    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: updatedPost.likes } : post)));
    }
  };

  const handleComment = async (postId, comment) => {
    const response = await fetch(`${API_URL}/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    const response = await fetch(`${API_URL}/${postId}/comments/${commentId}/like`, { method: 'POST' });
    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    }
  };

  const handleReply = async (postId, commentId, reply) => {
    const response = await fetch(`${API_URL}/${postId}/comments/${commentId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply),
    });
    if (response.ok) {
      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Community Forum</h1>
      <CreatePostForm onPostCreated={handlePostCreated} />
      <div className="posts-container">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onLikeComment={handleLikeComment}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
};

export default Chat;