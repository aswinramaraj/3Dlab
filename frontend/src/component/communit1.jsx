import React, { useState } from "react";
import PostCreator from "../Pages/Postcreate";
import '../cssfile/community1.css';
import Displaypost from "../Pages/DisplayPost";
import Navbar from "./Navbar";
function Community() {
  const [showPostCreator, setShowPostCreator] = useState(false);

  const handleOpenPostCreator = () => {
    setShowPostCreator(true);
  };

  const handleClosePostCreator = () => {
    setShowPostCreator(false);
  };

  return (
    <div className="community-page">
      <Navbar />
      <button className="add-post-btn" onClick={handleOpenPostCreator}>
        Add Post
      </button>

      {showPostCreator && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button className="close-modal-btn" onClick={handleClosePostCreator}>
                ×
              </button>
            </div>
            <PostCreator />
          </div>
        </div>
      )}
      <Displaypost />
    </div>
  );
}

export default Community;