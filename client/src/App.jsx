import React, { useEffect, Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthLayout from './components/layout/AuthLayout';
import Navbar from './components/layout/Navbar';
import WelcomeScreen from './components/shared/WelcomeScreen';
import WelcomeModal from './components/shared/WelcomeModal';
import { PageSkeleton } from './components/shared/Skeleton';

// Lazy load sayfa bileşenleri
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Logout = lazy(() => import('./pages/Logout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function AppContent() {
  const { checkAuthStatus, isAuthenticated, user, justLoggedIn, setJustLoggedIn } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Sadece giriş yapıldığında hoş geldin modal'ını göster
    if (user && justLoggedIn) {
      setShowWelcomeModal(true);
      setJustLoggedIn(false); // Flag'i sıfırla
    }
  }, [user, justLoggedIn, setJustLoggedIn]);

  const handleWelcomeComplete = () => {
    setShowWelcomeModal(false);
  };

  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        {/* Authenticated Layout with Navbar */}
        {isAuthenticated && user ? (
          <div className="h-screen relative overflow-hidden">
            <Navbar />
            
            <main className="relative z-10 h-full">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<WelcomeScreen user={user} />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
                <Route path="/forgot-password" element={<Navigate to="/" replace />} />
                <Route path="/reset-password/:token" element={<Navigate to="/" replace />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </main>

            {/* Welcome Modal */}
            <WelcomeModal 
              isOpen={showWelcomeModal}
              user={user}
              onComplete={handleWelcomeComplete}
            />
          </div>
        ) : (
          /* Unauthenticated Layout */
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="logout" element={<Logout />} />
            </Route>
          </Routes>
        )}
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;