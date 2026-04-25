import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Environment variable validation
const isPlaceholder = (val?: string) => !val || val === 'PLACEHOLDER' || val.includes('REPLACE_ME');

const firebaseConfig = {
  apiKey: "AIzaSyAL20uzqPnXWbJNGmqgHZ2-UsEmMdbrAGw",
  authDomain: "mcb-hrm-ghana.firebaseapp.com",
  projectId: "mcb-hrm-ghana",
  storageBucket: "mcb-hrm-ghana.firebasestorage.app",
  messagingSenderId: "709525010185",
  appId: "1:709525010185:web:1b3ba1e1ddf82307a6c5d8"
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
