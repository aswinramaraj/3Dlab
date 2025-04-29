import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, LogOut, UploadCloud, ClipboardList, Users, PlusSquare, LayoutDashboard, MessageSquare, Key, X, Plus, Edit, Trash2 } from "lucide-react";
import '../cssfile/teacher1.css';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navi = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [classCodes, setClassCodes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showClassCodeModal, setShowClassCodeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [selectedClassCode, setSelectedClassCode] = useState(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassCodes();
  }, []);

  useEffect(() => {
    if (selectedClassCode) {
      fetchMaterialsByClassCode(selectedClassCode);
    }
  }, [selectedClassCode]);

  const fetchClassCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/class-codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch class codes');
      const data = await response.json();
      setClassCodes(data);
    } catch (error) {
      console.error('Error fetching class codes:', error);
      setError('Failed to fetch class codes');
    }
  };

  const fetchMaterialsByClassCode = async (classCode) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/materials/${classCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to fetch materials');
    }
  };

  const handleCreateClassCode = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const teacherId = localStorage.getItem('teacherId');
      const response = await fetch('http://localhost:5000/api/class-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newClassCode,
          name: newClassName,
          teacherId: teacherId
        })
      });
      if (!response.ok) throw new Error('Failed to create class code');
      await fetchClassCodes();
      setShowClassCodeModal(false);
      setNewClassCode('');
      setNewClassName('');
    } catch (error) {
      console.error('Error creating class code:', error);
      setError('Failed to create class code');
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!selectedClassCode) {
      setError('Please select a class code first');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const teacherId = localStorage.getItem('teacherId');
      const formData = new FormData();
      formData.append('title', materialTitle);
      formData.append('description', materialDescription);
      formData.append('file', materialFile);
      formData.append('classCode', selectedClassCode);
      formData.append('teacherId', teacherId);

      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload material');
      await fetchMaterialsByClassCode(selectedClassCode);
      setShowMaterialModal(false);
      setMaterialTitle('');
      setMaterialDescription('');
      setMaterialFile(null);
    } catch (error) {
      console.error('Error uploading material:', error);
      setError('Failed to upload material');
    }
  };

  const handleDeleteClassCode = async (code) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/class-codes/${code}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete class code');
      await fetchClassCodes();
    } catch (error) {
      console.error('Error deleting class code:', error);
      setError('Failed to delete class code');
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete material');
      await fetchMaterialsByClassCode(selectedClassCode);
    } catch (error) {
      console.error('Error deleting material:', error);
      setError('Failed to delete material');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-title">Menu</div>
        <nav className="nav-links">
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="icon" /> Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <BookOpen className="icon" /> Materials
          </button>
          <button 
  className="nav-button"
  onClick={() => window.open('https://remarkable-cranachan-efd1a7.netlify.app/', '_blank')}
>
  <ClipboardList className="icon" /> Quizzes 
</button>

          <button className="nav-button logout"><LogOut className="icon" /> Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1 className="dashboard-title">Teacher's Dashboard</h1>
          <div className="profile-icon" />
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="class-codes-section">
              <div className="section-header">
                <h2>Class Codes</h2>
                <button className="add-button" onClick={() => setShowClassCodeModal(true)}>
                  <Plus size={20} /> New Class Code
                </button>
              </div>
              <div className="class-codes-grid">
                {classCodes.map((classCode) => (
                  <div key={classCode.code} className="class-code-card">
                    <div className="class-code-header">
                      <Key size={20} />
                      <span>{classCode.code}</span>
                    </div>
                    <div className="class-code-name">{classCode.name}</div>
                    <div className="class-code-actions">
                      <button onClick={() => handleDeleteClassCode(classCode.code)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="materials-section">
              <div className="section-header">
                <h2>Materials</h2>
                <div className="material-controls">
                  <select 
                    value={selectedClassCode || ''} 
                    onChange={(e) => setSelectedClassCode(e.target.value)}
                  >
                    <option value="">Select Class Code</option>
                    {classCodes.map((classCode) => (
                      <option key={classCode.code} value={classCode.code}>
                        {classCode.name} ({classCode.code})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="add-button"
                    onClick={() => setShowMaterialModal(true)}
                    disabled={!selectedClassCode}
                  >
                    <Plus size={20} /> Upload Material
                  </button>
                </div>
              </div>
              <div className="materials-grid">
                {materials.map((material) => (
                  <div key={material._id} className="material-card">
                    <div className="material-header">
                      <FileText size={20} />
                      <span>{material.title}</span>
                    </div>
                    <div className="material-description">{material.description}</div>
                    <div className="material-actions">
                      <button onClick={() => handleDeleteMaterial(material._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Class Code Modal */}
        {showClassCodeModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Class Code</h2>
                <button onClick={() => setShowClassCodeModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateClassCode}>
                <div className="form-group">
                  <label>Class Code:</label>
                  <input
                    type="text"
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Class Name:</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit">Create</button>
                  <button type="button" onClick={() => setShowClassCodeModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Material Upload Modal */}
        {showMaterialModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Upload Material</h2>
                <button onClick={() => setShowMaterialModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleUploadMaterial}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>File:</label>
                  <input
                    type="file"
                    onChange={(e) => setMaterialFile(e.target.files[0])}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit">Upload</button>
                  <button type="button" onClick={() => setShowMaterialModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}><X size={16} /></button>
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
