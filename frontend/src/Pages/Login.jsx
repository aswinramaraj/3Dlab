import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssfile/signup.css'; // Reusing the same CSS

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug log

      if (response.ok && data.user) {
        // Ensure we have all required user data
        const userData = {
          id: data.user.id,
          name: data.user.name || email.split('@')[0], // Use email username as fallback
          email: data.user.email,
          role: data.user.role || 'student'
        };

        console.log('Storing user data:', userData); // Debug log

        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Verify storage
        const storedData = localStorage.getItem('user');
        console.log('Stored data:', JSON.parse(storedData)); // Debug log

        // Redirect to main page
        navigate('/main');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="video-background-wrapper">
      <video autoPlay muted loop className="bg-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="main-wrapper">
        <div className="form-container">
          <h2>Welcome <span>Back</span></h2>
          <p>Please login to continue</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Your Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Your Password"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

           
            <button
     
      type='submit'
      disabled={isLoading}
      className="login1-btn"
    >
     {isLoading ? 'Logging in...' : 'Login'}
    </button>
          </form>

          <p className="signup-text">
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 