import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Environment variable validation
const isPlaceholder = (val?: string) => !val || val === 'PLACEHOLDER' || val.includes('REPLACE_ME');

const firebaseConfig = {
  apiKey: "AIzaSyB-WmQMEOpGVb2kpwK5yxAHRuuSlqP6RLE",
  authDomain: "nexus-hr-platform.firebaseapp.com",
  projectId: "nexus-hr-platform",
  storageBucket: "nexus-hr-platform.firebasestorage.app",
  messagingSenderId: "461790778294",
  appId: "1:461790778294:web:43777898ddaae6d6092717"
};

const hasCredentials = true; // Hardcoded for production reliability

import { getStorage } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const isFirebaseReady = hasCredentials;

// Diagnostic: Force a fresh connection if we were stuck in offline mode
if (hasCredentials && (import.meta as any).env.DEV) {
    console.log('[Firebase] Initializing Sync Protocol for Project:', firebaseConfig.projectId);
}

export default app;
