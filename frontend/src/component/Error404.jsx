// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../cssfile/notfound.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NotFound = () => {
  return (
    <div className="error">
     <DotLottieReact
      src="https://lottie.host/94a6605c-c5d6-4fca-91e4-ae498e6903b3/1Nt7J4nm0M.lottie"
      loop
      autoplay
    />
    </div>
  );
};

export default NotFound;
