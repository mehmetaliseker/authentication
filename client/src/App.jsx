import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // login, register, forgot-password, reset-password
  const [apiStatus, setApiStatus] = useState('');
  const [resetToken, setResetToken] = useState('');

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      setApiStatus(`✅ API Çalışıyor! Status: ${data.status}`);
    } catch (error) {
      setApiStatus('❌ API Bağlantısı Başarısız');
    }
  };

  const handleForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  const handleResetPassword = (token) => {
    setResetToken(token);
    setCurrentPage('reset-password');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
    setResetToken('');
  };

  const handleResetSuccess = () => {
    setCurrentPage('login');
    setResetToken('');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onForgotPassword={handleForgotPassword} />;
      case 'register':
        return <Register />;
      case 'forgot-password':
        return <ForgotPassword onBack={handleBackToLogin} onResetPassword={handleResetPassword} />;
      case 'reset-password':
        return (
          <ResetPassword
            token={resetToken}
            onSuccess={handleResetSuccess}
            onBack={handleBackToLogin}
          />
        );
      default:
        return <Login onForgotPassword={handleForgotPassword} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="mb-6">
          <button
            onClick={testAPI}
            className="w-full mb-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            🔍 API Bağlantısını Test Et
          </button>
          {apiStatus && (
            <p className={`text-center text-sm ${apiStatus.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
              {apiStatus}
            </p>
          )}
        </div>

        {currentPage !== 'forgot-password' && currentPage !== 'reset-password' && (
          <div className="flex mb-6">
            <button
              onClick={() => setCurrentPage('login')}
              className={`flex-1 py-2 px-4 rounded-l-md transition ${
                currentPage === 'login'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className={`flex-1 py-2 px-4 rounded-r-md transition ${
                currentPage === 'register'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Kayıt Ol
            </button>
          </div>
        )}

        {renderCurrentPage()}
      </div>
    </div>
  );
}

export default App;
