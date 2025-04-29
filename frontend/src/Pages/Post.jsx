import { FaTrash } from 'react-icons/fa'; // Import trash icon
import axios from 'axios';
import { toast } from 'react-toastify';

const Post = ({ post, fetchPosts }) => {
  const handleLikePost = async () => {
    try {
      await axios.post(`/api/forum/${post._id}/like`);
      toast.success('Post liked successfully');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/api/forum/${post._id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      <button
        onClick={handleLikePost}
        className="flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full text-sm"
      >
        ❤️ {post.likes}
      </button>
      <button
        onClick={handleDeletePost}
        className="flex items-center bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded-full text-sm"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default Post;