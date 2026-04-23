import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const apiUsageMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const user = (req as any).user;
    
    // Fire-and-forget: we don't await the DB write here to ensure zero impact on event loop responsiveness 
    (prisma as any).apiUsage.create({
      data: {
        organizationId: user?.organizationId || 'PUBLIC',
        method: req.method,
        path: req.baseUrl + req.path,
        statusCode: res.statusCode,
        duration: duration,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    }).catch((error: any) => {
      // Fail silently to not disrupt the main request flow
      console.error('[Telemetry Error]:', error);
    });
  });

  next();
};
