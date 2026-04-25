export const RoleRank = {
    DEV: 100,
    MD: 95,
    SUPER_ADMIN: 95,
    DIRECTOR: 90,
    HR_MANAGER: 88,
    FINANCE_MANAGER: 87,
    IT_MANAGER: 85,
    HR_OFFICER: 85,
    IT_ADMIN: 85,
    HR: 80,
    MID_MANAGER: 75,
    MANAGER: 70,
    SUPERVISOR: 60,
    STAFF: 50,
    EMPLOYEE: 50,
    CASUAL: 40
} as const;

export type RoleName = keyof typeof RoleRank;
export type RoleRankType = typeof RoleRank[RoleName];

export const ROLE_RANK_MAP: Record<string, number> = {
    ...RoleRank,
    // Human readable aliases
    'MANAGING DIRECTOR': RoleRank.MD,
    'SYSTEM DEVELOPER': RoleRank.DEV
};

export const ROLE_LABELS: Record<string, string> = {
  DEV: 'System Developer',
  MD: 'Managing Director',
  DIRECTOR: 'Director',
  HR_MANAGER: 'HR Manager',
  FINANCE_MANAGER: 'Finance Manager',
  HR_OFFICER: 'HR Officer',
  IT_MANAGER: 'IT Manager',
  IT_ADMIN: 'IT Admin',
  MANAGER: 'Manager',
  MID_MANAGER: 'Mid-Level Manager',
  SUPERVISOR: 'Supervisor',
  STAFF: 'Staff',
  CASUAL: 'Casual Worker',
};
