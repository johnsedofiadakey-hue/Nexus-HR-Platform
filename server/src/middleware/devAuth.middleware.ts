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
        const userEmail = decodedToken.email;
        
        // SECURITY GATE: Whitelist check
        const hardcodedWhitelist = ['johnsedofiadakey@gmail.com', 'stormglidelogistics.com'];
        const envWhitelist = (process.env.DEV_WHITELIST_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
        const whitelist = [...hardcodedWhitelist, ...envWhitelist].filter(Boolean).map(e => e.toLowerCase());
        
        if (whitelist.length > 0 && userEmail && !whitelist.includes(userEmail.toLowerCase())) {
            console.warn(`[DevAuth] Unauthorized access attempt by: ${userEmail}`);
            return res.status(403).json({ 
                error: 'Master Access Denied',
                details: 'This Google account is not on the administrator whitelist.' 
            });
        }
        
        (req as any).user = {
            id: `fb-${decodedToken.uid}`,
            email: userEmail,
            role: 'DEV',
            name: decodedToken.name || 'Cloud Admin',
            organizationId: null,
            rank: 100
        };

        console.log(`[DevAuth] Google Identity Verified: ${userEmail}`);
        return next();
    } catch (error: any) {
        console.error('[DevAuth] Firebase Token Verification FAILED:', error.message);
        return res.status(401).json({ 
            error: 'Development session expired or invalid.',
            details: error.message 
        });
    }
};
