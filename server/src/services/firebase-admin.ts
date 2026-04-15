import * as admin from 'firebase-admin';

const initializeFirebase = () => {
    if (admin.apps.length > 0) return;

    try {
        const serviceAccountVar = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
        
        if (serviceAccountVar) {
            console.log('[FirebaseAdmin] Initializing with Service Account from ENV...');
            const serviceAccount = JSON.parse(
                serviceAccountVar.startsWith('{') 
                ? serviceAccountVar 
                : Buffer.from(serviceAccountVar, 'base64').toString()
            );
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.warn('[FirebaseAdmin] No Service Account found. Falling back to default credentials...');
            admin.initializeApp({
                projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'nexus-hr-platform'
            });
        }
        console.log('[FirebaseAdmin] Application initialized successfully.');
    } catch (error: any) {
        console.error('[FirebaseAdmin] FAILED to initialize:', error.message);
    }
};

export { admin, initializeFirebase };
