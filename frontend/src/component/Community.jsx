import React from 'react'; 
import '../cssfile/community.css'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Community = () => {
  const navi = useNavigate();

  // Re-enable the handle function for navigation
  const handle = () => {
    navi('/chat');
  };

  return (
    <section className="community">
         <div className="text-container1">
      <h2>Join Our Community</h2>
<p>
People from around the world come together to share knowledge, grow their skills, and uplift one another.
Join a global learning community where passion meets purpose.
</p>

        {/* Add onClick to trigger navigation */}
        <button className="start-button1" onClick={handle}>Community</button>
      </div>
      <div className="image-container1">
          <DotLottieReact
              src="https://lottie.host/62e71996-239a-4a88-bcae-30b2616e4b61/Gj6EMc24wU.lottie"
              loop
              autoplay
            />
      </div>
     
    </section>
  );
};

export default Community;
