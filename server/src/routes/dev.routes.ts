import { Router } from 'express';
import {
  getSystemStats,
  checkIntegrity,
  getSecurityTelemetry,
  toggleTenantFeature,
  extendTrial,
  getSystemLogs,
  getTenantDetails,
  triggerBackup,
  grantBankTransferAccess,
  getApiUsageStats,
  bulkTenantAction,
  listOrganizations,
  createOrganization,
  listAllUsers,
  seedDemoTenant,
} from '../controllers/dev.controller';
import { devAuth } from '../middleware/devAuth.middleware';

const router = Router();

router.get('/stats', devAuth, getSystemStats);
router.get('/integrity', devAuth, checkIntegrity);
router.get('/telemetry', devAuth, getSecurityTelemetry);
router.get('/telemetry/api', devAuth, getApiUsageStats);
router.post('/tenant/feature', devAuth, toggleTenantFeature);
router.post('/tenant/trial', devAuth, extendTrial);
router.post('/tenant/bulk-action', devAuth, bulkTenantAction);
router.get('/logs', devAuth, getSystemLogs);
router.get('/tenant/:id', devAuth, getTenantDetails);
router.post('/backup', devAuth, triggerBackup);
router.post('/grant-bank-access', devAuth, grantBankTransferAccess);

// Tenant/Organization management
router.get('/organizations', devAuth, listOrganizations);
router.post('/organizations', devAuth, createOrganization);
router.get('/users', devAuth, listAllUsers);
router.post('/tenant/seed-demo', devAuth, seedDemoTenant);

export default router;
