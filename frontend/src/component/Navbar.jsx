import React from 'react'; // ✅
import '../cssfile/navbar.css'; // Adjust the path as necessary
import { FaSearch, FaShoppingCart, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // ✅


const Navbar = () => {
    const navi = useNavigate();
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">Virtulearn</h1>
        <div className="dropdown">Categories ▾</div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="navbar-right">
        
      </div>
    </nav>
  );
};

export default Navbar;
