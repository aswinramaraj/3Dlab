import React, { useEffect, useState } from 'react';
import '../cssfile/material.css'

export default function MaterialList() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/materials');
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const getIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['ppt', 'pptx'].includes(ext)) return '📊';
    if (['mp4', 'mov'].includes(ext)) return '📁';
    return '📎';
  };

  return (
    <div className="material-list">
      <h2>All Materials</h2>
      <div className="material-container">
        {materials.map((mat, idx) => (
          <a key={idx} className="material-card" href={mat.url} target="_blank" rel="noopener noreferrer">
            <div className="material-icon">{getIcon(mat.filename)}</div>
            <div className="material-name">{mat.filename}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
