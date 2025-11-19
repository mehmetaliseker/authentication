import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';

// Client tarafında Firebase config (bunlar public bilgiler)
const firebaseConfig = {
  apiKey: "AIzaSyBNFf1skaZji-IkT3qTEJcJP4VHgpRXzyo",
  authDomain: "authentication-33eb6.firebaseapp.com",
  projectId: "authentication-33eb6",
  storageBucket: "authentication-33eb6.appspot.com",
  messagingSenderId: "10864aaaf77414123",
  appId: "1:10864aaaf77414123:web:a0864aaaf77414123"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth servisini al
export const auth = getAuth(app);

// Google Auth Provider'ı oluştur
export const googleProvider = new GoogleAuthProvider();

// Popup için ayarlar
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Gerekli scope'ları ekle
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;
