import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-trigger" onClick={toggleDropdown}>
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
       

        <span className="profile-name">{user?.name || 'User'}</span>
        <i className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</i>
      </div>
      
      {isDropdownOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="profile-info">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'user@example.com'}</p>
              <span className="profile-role">{user?.role || 'Student'}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="profile-button" onClick={() => navigate('/profile')}>
              View Profile
            </button>
           

            <button className="profile-button logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 