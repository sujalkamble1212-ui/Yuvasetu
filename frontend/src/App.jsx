import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import EducationPage from './pages/EducationPage';
import CurrentAcademicPage from './pages/CurrentAcademicPage';
import SkillsPage from './pages/SkillsPage';
import ResumePage from './pages/ResumePage';
import DrivesPage from './pages/DrivesPage';
import ApplicationsPage from './pages/ApplicationsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminDrives from './pages/AdminDrives';
import AdminApplications from './pages/AdminApplications';
import AdminStudents from './pages/AdminStudents';
import AdminLogs from './pages/AdminLogs';

// App Layout Shell with responsive Sidebar & Navbar
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root Redirect Helper
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/drives" element={<DrivesPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/academics" element={<CurrentAcademicPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/resume" element={<ResumePage />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/drives" element={<AdminDrives />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
