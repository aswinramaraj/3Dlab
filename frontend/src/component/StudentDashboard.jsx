import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, LogOut, ClipboardList, Users, LayoutDashboard, MessageSquare, Lock, Download, User, Settings, Bell, Key, Plus, X } from "lucide-react";
import '../cssfile/student.css';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navi = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [classCodes, setClassCodes] = useState([]);
  const [selectedClassCode, setSelectedClassCode] = useState(null);
  const [showClassCodeModal, setShowClassCodeModal] = useState(false);
  const [newClassCode, setNewClassCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
    fetchClassCodes();
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedClassCode) {
      fetchMaterialsByClassCode(selectedClassCode);
    }
  }, [selectedClassCode]);

  const fetchClassCodes = async () => {
    try {
      const response = await fetch('/api/student/class-codes');
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

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAddClassCode = async () => {
    if (!newClassCode.trim()) {
      setError('Class code cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/student/class-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classCode: newClassCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add class code');
      }

      const data = await response.json();
      setClassCodes([...classCodes, data]);
      setSelectedClassCode(data.code);
      setShowClassCodeModal(false);
      setNewClassCode('');
      setError('');
    } catch (error) {
      setError(error.message);
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

  if (!user || user.role !== 'student') {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <Lock className="access-denied-icon" />
          <h1 className="access-denied-title">Access Denied</h1>
          <p className="access-denied-message">
            This dashboard is only accessible to students. If you believe this is an error, please contact the administrator.
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
              <p>Here's what's new in your learning journey</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <BookOpen className="stat-icon" />
                <div className="stat-info">
                  <h3>Classes</h3>
                  <p>{classCodes.length} enrolled</p>
                </div>
              </div>
              <div className="stat-card">
                <ClipboardList className="stat-icon" />
                <div className="stat-info">
                  <h3 >Quizzes</h3>
                  <p>{quizzes.length} available</p>
                </div>
              </div>
            </div>

            <div className="section-container">
              <h2 className="section-title">Your Classes</h2>
              <div className="class-codes-grid">
                {classCodes.map((code) => (
                  <div 
                    key={code._id} 
                    className={`class-code-card ${selectedClassCode === code.code ? 'active' : ''}`}
                    onClick={() => setSelectedClassCode(code.code)}
                  >
                    <Key className="card-icon blue" />
                    <div className="class-code-info">
                      <h3>{code.name || code.code}</h3>
                      <p>Code: {code.code}</p>
                    </div>
                  </div>
                ))}
                <div className="class-code-card add-new" onClick={() => setShowClassCodeModal(true)}>
                  <Plus className="card-icon green" />
                  <div className="class-code-info">
                    <h3>Add New Class</h3>
                    <p>Enter a class code</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedClassCode && (
              <div className="section-container">
                <h2 className="section-title">Recent Materials from {selectedClassCode}</h2>
                <div className="materials-grid">
                  {materials.slice(0, 3).map((material) => (
                    <div key={material._id} className="material-card">
                      <FileText className="card-icon blue" />
                      <div className="material-info">
                        <h3>{material.title}</h3>
                        <p>{material.description}</p>
                        <button className="download-button">
                          <Download className="icon" /> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      
      case 'materials':
        return (
          <div className="section-container">
            <div className="materials-header">
              <h2 className="section-title">Learning Materials</h2>
              <div className="class-selector">
                <select 
                  value={selectedClassCode || ''} 
                  onChange={(e) => setSelectedClassCode(e.target.value)}
                  className="class-select"
                >
                  <option value="">Select a class</option>
                  {classCodes.map((code) => (
                    <option key={code._id} value={code.code}>
                      {code.name || code.code}
                    </option>
                  ))}
                </select>
                <button className="add-class-button" onClick={() => setShowClassCodeModal(true)}>
                  <Plus className="icon" /> Add Class
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
                      <button className="download-button">
                        <Download className="icon" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Key className="empty-icon" />
                <h3>Select a class to view materials</h3>
                <p>Choose a class from the dropdown or add a new one</p>
              </div>
            )}
          </div>
        );
      
      case 'quizzes':
        return (
          <div className="section-container">
            <h2 className="section-title">Available Quizzes</h2>
            <div className="quizzes-grid">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="quiz-card">
                  <ClipboardList className="card-icon purple" />
                  <div className="quiz-info">
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                    <button className="start-quiz-button">
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
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
              <p className="student-id">Student ID: {user.studentId || 'N/A'}</p>
            </div>
            
            <div className="profile-details">
              <div className="detail-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="detail-item">
                <label>Course</label>
                <p>{user.course || 'Not specified'}</p>
              </div>
              <div className="detail-item">
                <label>Join Date</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Enrolled Classes</label>
                <p>{classCodes.length} classes</p>
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
        <div className="menu-title">Student Portal</div>
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
          <button 
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
             <button className="chatbot-button" onClick={() => navi('/chatbot')}>
  🤖
</button>
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
          <h1 className="dashboard-title">Student Dashboard</h1>
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
              <h2>Add Class Code</h2>
              <button className="close-button" onClick={() => setShowClassCodeModal(false)}>
                <X className="icon" />
              </button>
            </div>
            <div className="modal-body">
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
                {error && <p className="error-message">{error}</p>}
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowClassCodeModal(false)}>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleAddClassCode}>
                  Add Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard; 