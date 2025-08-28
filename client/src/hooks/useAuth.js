import { useState } from 'react';

export function useAuth() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        if (data.userId) {
          setMessage(`✅ Hoşgeldin ${data.user?.first_name || email}!`);
          // Burada localStorage'a token kaydedilebilir
          localStorage.setItem('userId', data.userId);
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
        if (data.id) {
          setMessage(`✅ Kayıt başarılı! Hoşgeldin ${data.first_name}!`);
          // Burada otomatik login yapılabilir
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

  return { message, login, register, isLoading };
}
