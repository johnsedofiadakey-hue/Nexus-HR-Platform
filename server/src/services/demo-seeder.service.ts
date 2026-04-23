import prisma from '../prisma/client';
import { hash } from 'bcryptjs';

export class DemoSeederService {
  static async seedTenantData(organizationId: string) {
    console.log(`[DemoSeeder] Initializing High-End Environment for ${organizationId}...`);

    // 1. Create High-End Departments
    const departments = [
      { name: 'Executive Strategy', code: 'EXEC', color: '#6366F1' },
      { name: 'Human Capital', code: 'HR', color: '#EC4899' },
      { name: 'Financial Operations', code: 'FIN', color: '#10B981' },
      { name: 'Product Engineering', code: 'ENG', color: '#3B82F6' },
      { name: 'Global Sales', code: 'SALES', color: '#F59E0B' },
      { name: 'Revenue Marketing', code: 'MKTG', color: '#8B5CF6' }
    ];

    const createdDepts = [];
    for (const d of departments) {
      const dept = await prisma.department.create({
        data: {
          name: d.name,
          organizationId,
          code: d.code,
          color: d.color
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

    for (const exec of executives) {
        await prisma.user.create({
            data: {
                fullName: exec.name,
                email: exec.email,
                password: commonPass,
                role: exec.role,
                status: 'ACTIVE',
                organizationId,
                jobTitle: exec.title,
                avatar: exec.avatar,
                departmentId: createdDepts.find(d => d.code === 'EXEC')?.id
            }
        });
    }

    // 3. Populate Professional Staff
    const staffTemplate = [
        { name: 'Alice Thompson', role: 'MANAGER', dept: 'HR', title: 'HR Director', email: 'alice@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
        { name: 'Marcus Chen', role: 'MANAGER', dept: 'ENG', title: 'Engineering Lead', email: 'marcus@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
        { name: 'Charlie Davis', role: 'STAFF', dept: 'ENG', title: 'Senior Developer', email: 'charlie@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
        { name: 'Elena Rodriguez', role: 'STAFF', dept: 'FIN', title: 'Senior Auditor', email: 'elena@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        { name: 'David Kim', role: 'STAFF', dept: 'SALES', title: 'Account Executive', email: 'david@demo-sand.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
    ];

    for (const s of staffTemplate) {
      await prisma.user.create({
        data: {
          fullName: s.name,
          email: s.email,
          password: commonPass,
          role: s.role,
          status: 'ACTIVE',
          organizationId,
          departmentId: createdDepts.find(d => d.code === s.dept)?.id,
          jobTitle: s.title,
          avatar: s.avatar
        }
      });
    }

    // 4. Institutional Announcements
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Q2 Strategic Roadmap Unveiled',
          content: 'We are excited to share our vision for the upcoming quarter, focusing on global expansion and AI-driven efficiency.',
          importance: 'HIGH',
          organizationId,
          type: 'STRATEGY'
        },
        {
          title: 'New Health & Wellness Initiative',
          content: 'Starting next month, all employees will have access to our subsidized premium health membership program.',
          importance: 'MEDIUM',
          organizationId,
          type: 'BENEFITS'
        }
      ]
    });

    console.log(`[DemoSeeder] High-End Environment Provisioned for ${organizationId}`);
  }
}
