import React, { useRef, useEffect, useState } from 'react';
import { BookOpen, FileText, LogOut, UploadCloud, ClipboardList, Users, PlusSquare, LayoutDashboard, MessageSquare, Lock, Key, X, Plus, Edit, Trash2, Settings, User, Bell } from "lucide-react";
import '../cssfile/teacher1.css';
import '../cssfile/access-denied.css';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navi = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
    fetchClassCodes();
  }, []);

  useEffect(() => {
    if (selectedClassCode) {
      fetchMaterialsByClassCode(selectedClassCode);
    }
  }, [selectedClassCode]);

  const fetchClassCodes = async () => {
    try {
      const response = await fetch('/api/teacher/class-codes');
      const data = await response.json();
      setClassCodes(data);
    } catch (error) {
      console.error('Error fetching class codes:', error);
    }
  };

  const fetchMaterialsByClassCode = async (code) => {
    try {
      const response = await fetch(`/api/materials/class/${code}`);
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleCreateClassCode = async () => {
    if (!newClassCode.trim() || !newClassName.trim()) {
      setError('Class code and name cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/teacher/class-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: newClassCode,
          name: newClassName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create class code');
      }

      const data = await response.json();
      setClassCodes([...classCodes, data]);
      setShowClassCodeModal(false);
      setNewClassCode('');
      setNewClassName('');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUploadMaterial = async () => {
    if (!selectedClassCode) {
      setError('Please select a class code first');
      return;
    }

    if (!materialTitle.trim() || !materialDescription.trim() || !materialFile) {
      setError('Please fill in all fields and upload a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', materialTitle);
      formData.append('description', materialDescription);
      formData.append('file', materialFile);
      formData.append('classCode', selectedClassCode);

      const response = await fetch('/api/materials', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload material');
      }

      const data = await response.json();
      setMaterials([...materials, data]);
      setShowMaterialModal(false);
      setMaterialTitle('');
      setMaterialDescription('');
      setMaterialFile(null);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteClassCode = async (codeId) => {
    if (!window.confirm('Are you sure you want to delete this class code? This will also delete all associated materials.')) {
      return;
    }

    try {
      const response = await fetch(`/api/teacher/class-codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete class code');
      }

      setClassCodes(classCodes.filter(code => code._id !== codeId));
      if (selectedClassCode === codeId) {
        setSelectedClassCode(null);
        setMaterials([]);
      }
    } catch (error) {
      console.error('Error deleting class code:', error);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete material');
      }

      setMaterials(materials.filter(material => material._id !== materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navi('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <Lock className="access-denied-icon" />
          <h1 className="access-denied-title">Access Denied</h1>
          <p className="access-denied-message">
            This dashboard is only accessible to teachers. If you believe this is an error, please contact the administrator.
          </p>
          <button className="back-button" onClick={() => navi('/main')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="welcome-section">
              <h2>Welcome back, {user.name}!</h2>
              <p>Manage your classes and materials from here</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <Key className="stat-icon" />
                <div className="stat-info">
                  <h3>Class Codes</h3>
                  <p>{classCodes.length} created</p>
                </div>
              </div>
              <div className="stat-card">
                <FileText className="stat-icon" />
                <div className="stat-info">
                  <h3>Materials</h3>
                  <p>{materials.length} uploaded</p>
                </div>
              </div>
            </div>

            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">Your Class Codes</h2>
                <button className="add-button" onClick={() => setShowClassCodeModal(true)}>
                  <Plus className="icon" /> Create New Class
                </button>
              </div>
              <div className="class-codes-grid">
                {classCodes.map((code) => (
                  <div 
                    key={code._id} 
                    className={`class-code-card ${selectedClassCode === code._id ? 'active' : ''}`}
                    onClick={() => setSelectedClassCode(code._id)}
                  >
                    <Key className="card-icon blue" />
                    <div className="class-code-info">
                      <h3>{code.name}</h3>
                      <p>Code: {code.code}</p>
                    </div>
                    <button 
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClassCode(code._id);
                      }}
                    >
                      <Trash2 className="icon" />
                    </button>
                  </div>
                ))}
                {classCodes.length === 0 && (
                  <div className="empty-state">
                    <Key className="empty-icon" />
                    <h3>No class codes yet</h3>
                    <p>Create a class code to get started</p>
                  </div>
                )}
              </div>
            </div>

            {selectedClassCode && (
              <div className="section-container">
                <div className="section-header">
                  <h2 className="section-title">Materials for {classCodes.find(c => c._id === selectedClassCode)?.name}</h2>
                  <button className="add-button" onClick={() => setShowMaterialModal(true)}>
                    <UploadCloud className="icon" /> Upload Material
                  </button>
                </div>
                <div className="materials-grid">
                  {materials.map((material) => (
                    <div key={material._id} className="material-card">
                      <FileText className="card-icon blue" />
                      <div className="material-info">
                        <h3>{material.title}</h3>
                        <p>{material.description}</p>
                        <div className="material-actions">
                          <button className="edit-button">
                            <Edit className="icon" />
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteMaterial(material._id)}
                          >
                            <Trash2 className="icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {materials.length === 0 && (
                    <div className="empty-state">
                      <FileText className="empty-icon" />
                      <h3>No materials yet</h3>
                      <p>Upload materials for this class</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );
      
      case 'materials':
        return (
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Manage Materials</h2>
              <div className="class-selector">
                <select 
                  value={selectedClassCode || ''} 
                  onChange={(e) => setSelectedClassCode(e.target.value)}
                  className="class-select"
                >
                  <option value="">Select a class</option>
                  {classCodes.map((code) => (
                    <option key={code._id} value={code._id}>
                      {code.name}
                    </option>
                  ))}
                </select>
                <button className="add-button" onClick={() => setShowMaterialModal(true)}>
                  <UploadCloud className="icon" /> Upload Material
                </button>
              </div>
            </div>

            {selectedClassCode ? (
              <div className="materials-grid">
                {materials.map((material) => (
                  <div key={material._id} className="material-card">
                    <FileText className="card-icon blue" />
                    <div className="material-info">
                      <h3>{material.title}</h3>
                      <p>{material.description}</p>
                      <div className="material-actions">
                        <button className="edit-button">
                          <Edit className="icon" />
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteMaterial(material._id)}
                        >
                          <Trash2 className="icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {materials.length === 0 && (
                  <div className="empty-state">
                    <FileText className="empty-icon" />
                    <h3>No materials yet</h3>
                    <p>Upload materials for this class</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <Key className="empty-icon" />
                <h3>Select a class to view materials</h3>
                <p>Choose a class from the dropdown or create a new one</p>
              </div>
            )}
          </div>
        );
      
      case 'quizzes':
        return (
          <div className="section-container">
            <h2 className="section-title">Create and Manage Quizzes</h2>
            <div className="quizzes-grid">
              <div className="quiz-card">
                <ClipboardList className="card-icon purple" />
                <div className="quiz-info">
                  <h3>Create New Quiz</h3>
                  <p>Design a new quiz for your students</p>
                  <button className="start-quiz-button">
                    Create Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2>{user.name}</h2>
              <p className="teacher-id">Teacher ID: {user.teacherId || 'N/A'}</p>
            </div>
            
            <div className="profile-details">
              <div className="detail-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="detail-item">
                <label>Department</label>
                <p>{user.department || 'Not specified'}</p>
              </div>
              <div className="detail-item">
                <label>Join Date</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Class Codes</label>
                <p>{classCodes.length} created</p>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="edit-profile-button">
                <Settings className="icon" /> Edit Profile
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="menu-title">Teacher Portal</div>
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
            <FileText className="icon" /> Materials
          </button>
          <button 
            className={`nav-button ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <ClipboardList className="icon" /> Quizzes
          </button>
          <button 
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="icon" /> Profile
          </button>
          <button className="nav-button logout" onClick={handleLogout}>
            <LogOut className="icon" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <div className="header-actions">
            <button className="notification-button">
              <Bell className="icon" />
            </button>
            <div className="profile-icon">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {renderDashboardContent()}
      </main>

      {/* Class Code Modal */}
      {showClassCodeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Class Code</h2>
              <button className="close-button" onClick={() => setShowClassCodeModal(false)}>
                <X className="icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="className">Class Name</label>
                <input
                  type="text"
                  id="className"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Enter class name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="classCode">Class Code</label>
                <input
                  type="text"
                  id="classCode"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value)}
                  placeholder="Enter class code"
                  className="form-input"
                />
                <p className="form-hint">This code will be used by students to join your class</p>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowClassCodeModal(false)}>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleCreateClassCode}>
                  Create Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Material Upload Modal */}
      {showMaterialModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload Material</h2>
              <button className="close-button" onClick={() => setShowMaterialModal(false)}>
                <X className="icon" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="materialTitle">Title</label>
                <input
                  type="text"
                  id="materialTitle"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="Enter material title"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="materialDescription">Description</label>
                <textarea
                  id="materialDescription"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  placeholder="Enter material description"
                  className="form-input"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label htmlFor="materialFile">File</label>
                <input
                  type="file"
                  id="materialFile"
                  onChange={(e) => setMaterialFile(e.target.files[0])}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="materialClassCode">Class</label>
                <select
                  id="materialClassCode"
                  value={selectedClassCode || ''}
                  onChange={(e) => setSelectedClassCode(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select a class</option>
                  {classCodes.map((code) => (
                    <option key={code._id} value={code._id}>
                      {code.name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowMaterialModal(false)}>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleUploadMaterial}>
                  Upload Material
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;