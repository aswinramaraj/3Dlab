import React from 'react'; // ✅
import '../cssfile/topic.css'; // Adjust the path as necessary

const data = {
  Physics: [
    { name: 'Ohm\'s Law', learners: '8,000,000' },
    { name: 'Electric Circuits', learners: '5,000,000' },
    { name: 'Electromagnetism', learners: '4,500,000' },
  ],
  Biology: [
    { name: 'Genetics', learners: '8,000,000' },
    { name: 'Cell Biology', learners: '6,500,000' },
    { name: 'Molecular Biology', learners: '3,100,000' },
  ],
  Chemistry: [
    { name: 'Chemical Reactions', learners: '1,800,000' },
    { name: 'Organic Chemistry', learners: '1,200,000' },
    { name: 'Inorganic Chemistry', learners: '1,700,000' },
  ],
  IT: [
    { name: 'Syntax Stoplight', learners: '1,500,000' },
    { name: 'Code marbles', learners: '2,300,000' },
    { name: 'Debug Dash', learners: '2,100,000' },
  ],
};
  const handle = () => {
    const categoriesSection = document.querySelector('.categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  
};

const TopicsByCategory = () => {
  return (
    <div className="topics-section">
      <h2>Popular topics by category</h2>
      <div className="topics-grid">
        {Object.entries(data).map(([category, topics]) => (
          <div className="category-column" key={category}>
            <h4>{category}</h4>
            <ul>
              {topics.map((topic, idx) => (
                <li key={idx}>
                  <span className="topic-name">{topic.name}</span>
                  <span className="learners">{topic.learners}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button className="explore-btn" onClick={handle}>Explore more topics</button>
    </div>
  );
};

export default TopicsByCategory;
