import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB-WmQMEOpGVb2kpwK5yxAHRuuSlqP6RLE",
  authDomain: "nexus-hr-platform.firebaseapp.com",
  projectId: "nexus-hr-platform",
  storageBucket: "nexus-hr-platform.firebasestorage.app",
  messagingSenderId: "461790778294",
  appId: "1:461790778294:web:43777898ddaae6d6092717"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
