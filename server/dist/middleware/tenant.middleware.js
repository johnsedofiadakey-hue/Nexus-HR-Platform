"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTenant = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const resolveTenant = async (req, res, next) => {
    try {
        const host = req.get('host') || '';
        const origin = req.get('origin') || '';
        const referer = req.get('referer') || '';
        const customDomainHeader = req.get('x-tenant-domain');
        // 1. Check if we are on a custom domain (Prioritize the explicit header from frontend)
        let domainToMatch = customDomainHeader || '';
        if (!domainToMatch) {
            // Try resolving from host if it's not our main domain
            const mainDomains = ['nexus-hr-platform-api.onrender.com', 'localhost'];
            if (!mainDomains.some(d => host.includes(d))) {
                domainToMatch = host.replace('www.', '');
            }
        }
        if (domainToMatch) {
            const organization = await client_1.default.organization.findFirst({
                where: {
                    OR: [
                        { customDomain: domainToMatch },
                        { subdomain: domainToMatch.split('.')[0] }
                    ]
                },
                select: { id: true, name: true, customDomain: true, subdomain: true }
            });
            if (organization) {
                req.organizationId = organization.id;
                req.organization = organization;
            }
        }
        next();
    }
    catch (error) {
        console.error('[TenantResolver] Error:', error);
        next();
    }
};
exports.resolveTenant = resolveTenant;
