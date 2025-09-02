import { useState } from 'react';

export function useAuth() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(email, password) {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.accessToken && data.user) {
          setMessage(`✅ Hoşgeldin ${data.user.first_name || email}!`);
          setUser(data.user);
          setIsAuthenticated(true);
          
          // Token'ları localStorage'a kaydet
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setMessage(data.message || 'Giriş başarısız');
        }
      } else {
        setMessage(data.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }

  async function register(userData) {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.user) {
          setMessage(`✅ Kayıt başarılı! Hoşgeldin ${data.user.first_name}!`);
        } else {
          setMessage(data.message || 'Kayıt başarısız');
        }
      } else {
        setMessage(data.message || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Register error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    setMessage('');
    
    try {
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = await response.json();
      
      // Başarılı olsun ya da olmasın, client tarafında temizlik yap
      setUser(null);
      setIsAuthenticated(false);
      setMessage(data.message || 'Başarıyla çıkış yapıldı');
      
      // localStorage'dan token'ları temizle
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Hata olsa bile client tarafında temizlik yap
      setUser(null);
      setIsAuthenticated(false);
      setMessage('Çıkış yapıldı');
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }

  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini yükle
  function checkAuthStatus() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Geçersiz veri varsa temizle
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }

  return { 
    message, 
    login, 
    register, 
    logout, 
    isLoading, 
    user, 
    isAuthenticated, 
    checkAuthStatus 
  };
}
