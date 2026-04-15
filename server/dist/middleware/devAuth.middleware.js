"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devAuth = void 0;
const firebase_admin_1 = require("../services/firebase-admin");
// Ensure firebase is initialized before use
(0, firebase_admin_1.initializeFirebase)();
/**
 * Dev Authentication Middleware (Firebase Edition)
 * Verifies that the request is coming from an authorized Google user.
 */
const devAuth = async (req, res, next) => {
    const firebaseToken = req.headers['x-dev-firebase-token'];
    const masterKey = req.headers['x-dev-master-key'];
    const envMasterKey = process.env.DEV_MASTER_KEY || 'NEXUS-DEV-MASTER-2025-SECURE';
    // 1. VAULT OVERRIDE (PIN-Based or Env-Based)
    const isOverride = (masterKey && masterKey.trim() === envMasterKey.trim()) || (masterKey === '564669');
    if (isOverride) {
        req.user = {
            id: 'master-vault-root',
            role: 'DEV',
            name: 'Master Console Operator',
            organizationId: null,
            rank: 100
        };
        console.log(`[DevAuth] Master Vault Access Granted @ ${req.path}`);
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
        const decodedToken = await firebase_admin_1.admin.auth().verifyIdToken(firebaseToken);
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
        req.user = {
            id: `fb-${decodedToken.uid}`,
            email: userEmail,
            role: 'DEV',
            name: decodedToken.name || 'Cloud Admin',
            organizationId: null,
            rank: 100
        };
        console.log(`[DevAuth] Google Identity Verified: ${userEmail}`);
        return next();
    }
    catch (error) {
        console.error('[DevAuth] Firebase Token Verification FAILED:', error.message);
        return res.status(401).json({
            error: 'Development session expired or invalid.',
            details: error.message
        });
    }
};
exports.devAuth = devAuth;
