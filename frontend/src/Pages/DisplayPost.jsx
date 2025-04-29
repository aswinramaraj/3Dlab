import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import '../cssfile/displaypost.css';
import { Heart, MessageCircle, Share2, MoreVertical, ChevronDown } from 'lucide-react';

function DisplayPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
    
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      
      // Fetch likes and comments for each post
      postsData.forEach(post => {
        fetchLikes(post.id);
        fetchComments(post.id);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const likesQuery = query(collection(db, 'likes'), where('postId', '==', postId));
      const querySnapshot = await getDocs(likesQuery);
      setLikes(prev => ({
        ...prev,
        [postId]: querySnapshot.size
      }));
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const commentsQuery = query(
        collection(db, 'comments'), 
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(commentsQuery);
      const commentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        };
      });
      setComments(prev => ({
        ...prev,
        [postId]: commentsData
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await addDoc(collection(db, 'likes'), {
        postId,
        userId: 'current-user-id', // Replace with actual user ID
        createdAt: serverTimestamp()
      });
      
      // Update likes count
      setLikes(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim() || !currentUser) return;

    try {
      const commentData = {
        postId,
        content: commentText,
        author: currentUser.name || 'Anonymous',
        authorId: currentUser.id,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      // Update local state
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), {
          id: docRef.id,
          ...commentData,
          createdAt: new Date()
        }]
      }));

      setCommentText('');
      setActiveCommentPost(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      await navigator.share({
        title: 'Check out this post!',
        text: 'I found this interesting post',
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const toggleComments = (postId) => {
    setActiveCommentPost(activeCommentPost === postId ? null : postId);
  };

  const toggleShowAllComments = (postId) => {
    setShowAllComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="posts-container">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          {/* Header Row */}
          <div className="post-header">
            <div className="user-info">
              <img 
                src="/default-avatar.png" 
                alt="User avatar" 
                className="user-avatar"
              />
              <div className="user-details">
                <span className="username">{post.author || 'Anonymous'}</span>
                <span className="post-time">
                  {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}
                </span>
              </div>
            </div>
            <button className="more-options">
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Image Row */}
          {post.images && post.images.length > 0 && (
            <div className="post-images">
              {post.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image.url} 
                  alt={`Post image ${index + 1}`} 
                  className="post-image"
                />
              ))}
            </div>
          )}

          {/* Content Row */}
          <div className="post-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Interaction Row */}
          <div className="post-actions">
            <button 
              className="action-button like"
              onClick={() => handleLike(post.id)}
            >
              <Heart size={16} />
              <span>{likes[post.id] || 0}</span>
            </button>
            
            <button 
              className="action-button comment"
              onClick={() => toggleComments(post.id)}
            >
              <MessageCircle size={16} />
              <span>{comments[post.id]?.length || 0}</span>
            </button>
            
            <button 
              className="action-button share"
              onClick={() => handleShare(post.id)}
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Comments Section */}
          {activeCommentPost === post.id && (
            <div className="comments-section">
              <div className="comments-list">
                {(showAllComments[post.id] 
                  ? comments[post.id] 
                  : comments[post.id]?.slice(0, 3)
                )?.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-time">
                        {comment.createdAt instanceof Date ? 
                          comment.createdAt.toLocaleDateString() : 
                          comment.createdAt?.toDate?.().toLocaleDateString() || ''}
                      </span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                ))}
                {comments[post.id]?.length > 3 && !showAllComments[post.id] && (
                  <button 
                    className="show-more-comments"
                    onClick={() => toggleShowAllComments(post.id)}
                  >
                    <ChevronDown size={14} />
                    Show {comments[post.id].length - 3} more comments
                  </button>
                )}
              </div>
              <div className="comment-input">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={currentUser ? "Write a comment..." : "Please log in to comment"}
                  disabled={!currentUser}
                />
                <button 
                  onClick={() => handleComment(post.id)}
                  disabled={!currentUser || !commentText.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DisplayPost; 