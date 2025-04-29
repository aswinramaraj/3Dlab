import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import Loader from '../component/Loader';
import toast from 'react-hot-toast';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ author: '', title: '', content: '' });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/forum');
      setPosts(res.data);
    } catch (err) {
      toast.error('Failed to load posts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forum', newPost);
      toast.success('Post created!');
      setNewPost({ author: '', title: '', content: '' });
      fetchPosts();
    } catch {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">📢 Forum</h1>

      <form onSubmit={handlePostSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-lg mb-10">
        <input
          type="text"
          placeholder="Author"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          className="w-full border rounded-md p-2"
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full border rounded-md p-2"
          required
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="w-full border rounded-md p-2"
          required
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
          Create Post
        </button>
      </form>

      {loading ? <Loader /> : (
        <div className="space-y-8">
          {posts.map(post => (
            <Post key={post._id} post={post} fetchPosts={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;
