import prisma from '../prisma/client';
import { hash } from 'bcryptjs';

export class DemoSeederService {
  static async seedTenantData(organizationId: string) {
    console.log(`[DemoSeeder] Initializing High-End Environment for ${organizationId}...`);

    // 1. Create High-End Departments
    const departments = [
      { name: 'Executive Strategy' },
      { name: 'Human Capital' },
      { name: 'Financial Operations' },
      { name: 'Product Engineering' },
      { name: 'Global Sales' },
      { name: 'Revenue Marketing' }
    ];

    const createdDepts = [];
    for (const d of departments) {
      const dept = await prisma.department.create({
        data: {
          name: d.name,
          organizationId
        }
      });
      createdDepts.push(dept);
    }

    const commonPass = await hash('NexusDemo@2025', 10);

    // 2. Provision High-Level Executives (Directors)
    const executives = [
        { name: 'Sarah Montgomery', role: 'MD', email: `md@demo-sand.com`, title: 'Chief Executive Officer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { name: 'Julian Vance', role: 'MD', email: `finance@demo-sand.com`, title: 'Chief Financial Officer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian' }
    ];

    let seedMDId = '';

    for (const exec of executives) {
        const user = await prisma.user.create({
            data: {
                fullName: exec.name,
                email: exec.email,
                passwordHash: commonPass,
                role: exec.role,
                status: 'ACTIVE',
                organizationId,
                jobTitle: exec.title,
                avatarUrl: exec.avatar,
                departmentId: createdDepts.find(d => d.name === 'Executive Strategy')?.id
            }
        });
        if (exec.role === 'MD' && !seedMDId) seedMDId = user.id;
    }

    // 3. Populate Professional Staff
    const staffTemplate = [
        { name: 'Alice Thompson', role: 'MANAGER', dept: 'Human Capital', title: 'HR Director', email: 'alice@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
        { name: 'Marcus Chen', role: 'MANAGER', dept: 'Product Engineering', title: 'Engineering Lead', email: 'marcus@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
        { name: 'Charlie Davis', role: 'STAFF', dept: 'Product Engineering', title: 'Senior Developer', email: 'charlie@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
        { name: 'Elena Rodriguez', role: 'STAFF', dept: 'Financial Operations', title: 'Senior Auditor', email: 'elena@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        { name: 'David Kim', role: 'STAFF', dept: 'Global Sales', title: 'Account Executive', email: 'david@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
    ];

    for (const s of staffTemplate) {
      await prisma.user.create({
        data: {
          fullName: s.name,
          email: s.email,
          passwordHash: commonPass,
          role: s.role,
          status: 'ACTIVE',
          organizationId,
          departmentId: createdDepts.find(d => d.name === s.dept)?.id,
          jobTitle: s.title,
          avatarUrl: s.avatar
        }
      });
    }

    // 4. Institutional Announcements
    if (seedMDId) {
        await prisma.announcement.createMany({
          data: [
            {
              title: 'Q2 Strategic Roadmap Unveiled',
              content: 'We are excited to share our vision for the upcoming quarter, focusing on global expansion and AI-driven efficiency.',
              priority: 'HIGH',
              organizationId,
              targetAudience: 'ALL',
              createdById: seedMDId
            },
            {
              title: 'New Health & Wellness Initiative',
              content: 'Starting next month, all employees will have access to our subsidized premium health membership program.',
              priority: 'NORMAL',
              organizationId,
              targetAudience: 'ALL',
              createdById: seedMDId
            }
          ]
        });
    }

    console.log(`[DemoSeeder] High-End Environment Provisioned for ${organizationId}`);
    return { mdEmail: `md@demo-sand.com` };
  }
}
