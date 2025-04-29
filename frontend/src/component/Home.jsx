import React from 'react'
import '../cssfile/home.css'



const Home = () => {
  const handleGetStarted = () => {
    const categoriesSection = document.querySelector('.categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className='home'>
    <div className='home-side-text'>
      <h1>Remote study for anyone anywhere</h1>
      <h3 className='text2'>TO MAKE THE BETTER WORLD</h3>
      <button className="get-started-btn" onClick={handleGetStarted}>
      Get Started
    </button>
    </div>
 </div>
  )
}


export default Home