import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service';
import { getRoleRank } from '../middleware/auth.middleware';
import prisma from '../prisma/client';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let orgId = user?.organizationId;

    // Public endpoint — user may not be authenticated (login page branding)
    if (!orgId) {
      const tenantDomain = req.headers['x-tenant-domain'] as string;
      if (tenantDomain && tenantDomain !== 'nexus-hr-platform.web.app' && tenantDomain !== 'localhost') {
        const orgMatch = await prisma.organization.findFirst({
          where: {
            OR: [
              { customDomain: tenantDomain },
              { subdomain: tenantDomain.split('.')[0] }
            ]
          }
        });
        if (orgMatch) {
          orgId = orgMatch.id;
        }
      }
    }
    
    orgId = orgId || 'default-tenant';

    const isAdmin = user ? getRoleRank(user.role) >= 85 : false; 
    const settings = await settingsService.getSettings(orgId, isAdmin);
    
    res.json(settings || {});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (getRoleRank(user.role) < 90) {
      return res.status(403).json({ error: 'Only MD can update admin settings' });
    }
    const orgId = user?.organizationId || 'default-tenant';
    const settings = await settingsService.updateSettings(orgId, req.body);
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
