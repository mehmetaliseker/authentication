// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNaZOvYTLFNkumaXp8vXu5_JP3maTlBWY",
  authDomain: "authentication-33eb6.firebaseapp.com",
  projectId: "authentication-33eb6",
  storageBucket: "authentication-33eb6.firebasestorage.app",
  messagingSenderId: "509500419432",
  appId: "1:509500419432:web:7954acb4d379e4ccdabadd",
  measurementId: "G-Y6BXJE2V8S"
};

// Initialize Firebase
let app;
let analytics;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  
  // Analytics sadece production'da çalıştır
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    analytics = getAnalytics(app);
  }
  
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Google provider konfigürasyonu
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    access_type: 'offline'
  });
  
  console.log('✅ Firebase başarıyla başlatıldı');
} catch (error) {
  console.error('❌ Firebase başlatma hatası:', error);
  throw error;
}

export { auth, googleProvider, signInWithPopup };
export default app;
