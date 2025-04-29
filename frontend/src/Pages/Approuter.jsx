import React, { useRef } from 'react'; // ✅
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './Main'; // Adjust the path as necessary
import TeacherDashboard from '../component/TeacherDashboard'; // Updated import
import StudentDashboard from '../component/StudentDashboard';
import SignupPage from './Signup';
import LoginPage from './Login';
import FileUpload from '../component/Fileupload'; // Adjust the path as necessary
import Community from '../component/communit1';
import MaterialList from '../component/MaterialList';
import NotFound from '../component/Error404';
import ProfilePage from './ProfilePage';
import Chatbot from './Chatbot';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRouter = () => {
    const navi = useRef(null);
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path='/chatbot' element={<Chatbot/>}/>
                <Route 
                    path="/main" 
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/teacher-dashboard" 
                    element={
                        <ProtectedRoute>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/student-dashboard" 
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/file-upload" 
                    element={
                        <ProtectedRoute>
                            <FileUpload />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/chat" 
                    element={
                        <ProtectedRoute>
                            <Community />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/material-list" 
                    element={
                        <ProtectedRoute>
                            <MaterialList />
                        </ProtectedRoute>
                    } 
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;