import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';



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
