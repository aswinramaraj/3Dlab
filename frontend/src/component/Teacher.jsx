import React from 'react'; 
import '../cssfile/teacher.css'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const BecomeTeacher = () => {
  const navi = useNavigate();

  // Re-enable the handle function for navigation
  const handle = () => {
    navi('/teacher-dashboard');
  };

  return (
    <section className="become-teacher">
      <div className="image-container">
      <DotLottieReact
      src="https://lottie.host/5c9b9bc0-60bb-4554-8cd8-db39c64140db/KO1kuat7ur.lottie"
      loop
      autoplay
    />
      </div>
      <div className="text-container">
        <h2>Become a teacher</h2>
        <p>
        Educators from around the globe inspire millions of learners every day.
        We empower you with the tools to teach what you&apos;re passionate about.
        </p>
        {/* Add onClick to trigger navigation */}
        <button className="start-button" onClick={handle}>Start teaching today</button>
      </div>
    </section>
  );
};

export default BecomeTeacher;
