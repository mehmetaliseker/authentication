import React, { createContext, useState, useCallback } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

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
      
      // Backend'e logout isteği gönder
      if (currentUser.id) {
        const response = await fetch('http://localhost:3001/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id }),
        });

        const data = await response.json();
        setMessage(data.message || 'Başarıyla çıkış yapıldı');
      }
      
      // Firebase'den çıkış yap
      await firebaseSignOut(auth);
      
      // Client tarafında temizlik yap
      setUser(null);
      setIsAuthenticated(false);
      
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

  async function loginWithGoogle() {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Firebase ile Google girişi yap (popup kullan)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Firebase ID token'ını al
      const idToken = await user.getIdToken();
      
      // Backend'e Firebase token'ını gönder
      const response = await fetch('http://localhost:3001/auth/firebase/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Backend'den gelen JWT token'ları ve kullanıcı bilgilerini kaydet
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        setJustLoggedIn(true);
        setMessage(`✅ Google ile giriş başarılı! Hoşgeldin ${data.user.first_name || data.user.email}!`);
      } else {
        setMessage('❌ Google ile giriş başarısız: ' + (data.message || 'Bilinmeyen hata'));
      }
      
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setMessage('Google ile giriş iptal edildi');
      } else if (error.code === 'auth/popup-blocked') {
        setMessage('Popup engellendi. Lütfen popup engelleyicisini kapatın.');
      } else {
        setMessage('❌ Google ile giriş sırasında bir hata oluştu: ' + error.message);
      }
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
    loginWithGoogle,
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

