import React from 'react';
import '../cssfile/categories.css'; // Adjust the path as necessary

const categories = [
  { icon: '🧪', title: 'Chemistry Lab' },
  { icon: '⚛️', title: 'Physics Lab' },
  { icon: '🧬', title: 'Biology Lab' },
  { icon: '💻', title: 'Computer Science Lab' },
];

const Categories = () => {
  const handleClick = (title) => {
    if (title === 'Physics Lab') {
      window.open('https://share.arcware.cloud/v1/share-1c6968fa-b887-4577-9283-2394da3fc327', '_blank');
    }
  };

  return (
    <div className="categories-section">
      <h2>Lab Categories</h2>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() => handleClick(cat.title)}
            style={{ cursor: cat.title === 'Physics Lab' ? 'pointer' : 'default' }}
          >
            <span className="category-icon">{cat.icon}</span>
            <p className="category-title">{cat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
