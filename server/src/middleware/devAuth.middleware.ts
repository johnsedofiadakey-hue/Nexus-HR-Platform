import { Request, Response, NextFunction } from 'express';
import { admin, initializeFirebase } from '../services/firebase-admin';

// Ensure firebase is initialized before use
initializeFirebase();

/**
 * Dev Authentication Middleware (Firebase Edition)
 * Verifies that the request is coming from an authorized Google user.
 */
export const devAuth = async (req: Request, res: Response, next: NextFunction) => {
    const firebaseToken = req.headers['x-dev-firebase-token'] as string;
    const masterKey = req.headers['x-dev-master-key'] as string;
    const envMasterKey = process.env.DEV_MASTER_KEY || 'NEXUS-DEV-MASTER-2025-SECURE';

    // 1. LEGACY CLOAK (Allow master key as fallback for now during migration)
    if (masterKey && masterKey.trim() === envMasterKey.trim()) {
        (req as any).user = {
            id: 'legacy-master-dev',
            role: 'DEV',
            name: 'Master Administrator (Legacy)',
            organizationId: null,
            rank: 100
        };
        console.log(`[DevAuth] Legacy Master Key Verified: ${req.path}`);
        return next();
    }

    // 2. GOOGLE IDENTITY CHALLENGE
    if (!firebaseToken) {
        return res.status(401).json({ 
            error: 'Authentication failed: Development session token missing.',
            hint: 'Please login via the Dev Portal using Google.'
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        
        // SECURITY GATE: Whitelist check
        // You can add your specific email here to restrict access to ONLY YOU.
        // For now, we allow any valid Google user from the Firebase project to satisfy the DEV role.
        
        (req as any).user = {
            id: `fb-${decodedToken.uid}`,
            email: decodedToken.email,
            role: 'DEV',
            name: decodedToken.name || 'Cloud Admin',
            organizationId: null,
            rank: 100
        };

        console.log(`[DevAuth] Google Identity Verified: ${decodedToken.email}`);
        return next();
    } catch (error: any) {
        console.error('[DevAuth] Firebase Token Verification FAILED:', error.message);
        return res.status(401).json({ 
            error: 'Development session expired or invalid.',
            details: error.message 
        });
    }
};
