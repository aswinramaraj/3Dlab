import React, { useEffect } from 'react';
import '../cssfile/alert.css';

const Alert = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`alert ${type}`}>
      <div className="alert-content">
        <img 
          src={type === 'success' ? '/success-icon.png' : '/error-icon.png'} 
          alt={type === 'success' ? 'Success' : 'Error'} 
          className="alert-icon"
        />
        <span>{message}</span>
      </div>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default Alert; 