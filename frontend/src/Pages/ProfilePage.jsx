import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssfile/profile-page.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      console.log('Raw user data:', userData); // Debug log

      if (!userData) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      console.log('Parsed user data:', parsedUser); // Debug log
      
      // Validate required fields
      if (!parsedUser || !parsedUser.email) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      // Set default values for missing fields
      const userWithDefaults = {
        ...parsedUser,
        name: parsedUser.name || parsedUser.email.split('@')[0], // Use email username if name is missing
        role: parsedUser.role || 'student'
      };

      console.log('User with defaults:', userWithDefaults); // Debug log
      setUser(userWithDefaults);
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    const trimmedName = name.trim();
    if (!trimmedName) return 'U';
    
    const words = trimmedName.split(' ');
    if (words.length === 0) return 'U';
    
    return words
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error">User data not found. Please log in again.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {getInitials(user.name)}
        </div>
        <h1>{user.name}</h1>
        <span className="profile-role">{user.role}</span>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="profile-info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="profile-info-item">
            <span className="info-label">Role:</span>
            <span className="info-value">{user.role}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Settings</h2>
          <button className="profile-button">Change Password</button>
          <button className="profile-button">Update Profile</button>
        </div>

        <div className="profile-section">
          <h2>Recent Activity</h2>
          <p>No recent activity to display.</p>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/main')}>
        Back to Home
      </button>
    </div>
  );
};

export default ProfilePage; 