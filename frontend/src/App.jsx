import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import ProfileFormPage from './pages/ProfileFormPage';
import FeedPage from './pages/FeedPage';
import DashboardPage from './pages/DashboardPage';
import VerificationPage from './pages/VerificationPage';
import CommunityPage from './pages/CommunityPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gnezdo-bg flex items-center justify-center">
        <div className="text-gnezdo-orange font-bold animate-pulse">Загрузка...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gnezdo-bg flex items-center justify-center">
        <div className="text-gnezdo-orange font-bold animate-pulse">Загрузка...</div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gnezdo-bg font-sans flex flex-col">
      <Header isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      <main className="flex-1 max-w-md mx-auto w-full relative">
        <Routes>
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileFormPage /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
