import React from 'react'; 
import '../cssfile/teacher.css'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const BecomeStudent = () => {
  const navi = useNavigate();

  // Re-enable the handle function for navigation
  const handle = () => {
    navi('/student-dashboard');
  };

  return (
    <section className="become-student">
      
      <div className="text-container">
        <h2>Become a student</h2>
        <p>
        Learn from expert educators around the world.
        Discover what you love — and gain the skills to master it.
        </p>
        {/* Add onClick to trigger navigation */}
        <button className="start-button" onClick={handle}>Start learning today</button>
      </div>

      <div className="image-container">
      <DotLottieReact
      src="https://lottie.host/53b92180-6809-4a97-a254-d61f301ee361/5CbSaW4N91.lottie"
      loop
      autoplay
    />
      </div>
    </section>
  );
};

export default BecomeStudent;
