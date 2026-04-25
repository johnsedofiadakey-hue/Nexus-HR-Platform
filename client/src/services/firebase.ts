import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAL20uzqPnXWbJNGmqgHZ2-UsEmMdbrAGw",
  authDomain: "mcb-hrm-ghana.firebaseapp.com",
  projectId: "mcb-hrm-ghana",
  storageBucket: "mcb-hrm-ghana.firebasestorage.app",
  messagingSenderId: "709525010185",
  appId: "1:709525010185:web:1b3ba1e1ddf82307a6c5d8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
