import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar'
import Home from '../component/Home'
import Categories from '../component/Categories'
import TopicsByCategory from '../component/Topic'
import BecomeTeacher from '../component/Teacher'
import Community from '../component/Community'
import Profile from '../component/Profile'
import '..//App.css'
import BecomeStudent from '../component/Student'

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        } else {
          // If user data is invalid, clear it and redirect
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        // Redirect to login if no user data
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear invalid data and redirect
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div>
      <div className="header-container" style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '20px', 
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}>
        {user && <Profile user={user} onLogout={handleLogout} />}
      </div>
      <Navbar/>
      <Home/>
      <br />
      <br />
      <Categories/>
      <br /><br />
      <BecomeStudent/>
      <br />
      <br />
      <BecomeTeacher/>
      <br />
      <br />
      <br />
      <br />
      <Community/>
      <TopicsByCategory/>
    </div>
  )
}

export default Main