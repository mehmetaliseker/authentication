import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

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
          // lastLogin alanını güncelle
          const userWithLastLogin = {
            ...data.user,
            lastLogin: new Date().toISOString()
          };
          
          // Önce localStorage'a kaydet
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(userWithLastLogin));
          
          // State'i güncelle
          setUser(userWithLastLogin);
          setIsAuthenticated(true);
          setJustLoggedIn(true); // Giriş yapıldığını işaretle
          setMessage(`✅ Hoşgeldin ${data.user.first_name || email}!`);
          
          console.log('Login başarılı, state güncellendi:', { user: userWithLastLogin, isAuthenticated: true });
          
          return true;
        } else {
          setMessage(data.message || 'Giriş başarısız');
          return false;
        }
      } else {
        setMessage(data.message || 'Giriş başarısız');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      return false;
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
          return true;
        } else {
          setMessage(data.message || 'Kayıt başarısız');
          return false;
        }
      } else {
        setMessage(data.message || 'Kayıt başarısız');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      return false;
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

  async function updateProfile(profileData) {
    setIsLoading(true);
    setMessage('');
    
    try {
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('http://localhost:3001/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser.id,
          ...profileData 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.user) {
          // Güncellenmiş kullanıcı bilgilerini kaydet
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setMessage(data.message || 'Profil başarıyla güncellendi');
          return true;
        } else {
          setMessage(data.message || 'Profil güncellenemedi');
          return false;
        }
      } else {
        setMessage(data.message || 'Profil güncellenemedi');
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini yükle
  const checkAuthStatus = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    console.log('checkAuthStatus çalışıyor:', { storedUser: !!storedUser, storedToken: !!storedToken });
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        // Eğer lastLogin yoksa, şu anki zamanı ata
        if (!userData.lastLogin) {
          userData.lastLogin = new Date().toISOString();
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
        setIsAuthenticated(true);
        setJustLoggedIn(false); // Sayfa yenilendiğinde giriş yapılmış sayılmaz
        console.log('Auth durumu localStorage\'dan yüklendi:', userData);
      } catch (error) {
        console.error('localStorage verisi geçersiz:', error);
        // Geçersiz veri varsa temizle
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } else {
      console.log('localStorage\'da auth verisi yok');
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    message,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    isLoading,
    user,
    isAuthenticated,
    justLoggedIn,
    setJustLoggedIn,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook'u artık hooks/useAuth.js dosyasında
