export enum RoleRank {
    DEV = 100,
    MD = 95,
    DIRECTOR = 90,
    HR_MANAGER = 88,
    FINANCE_MANAGER = 87,
    IT_MANAGER = 85,
    HR_OFFICER = 85,
    MANAGER = 70,
    SUPERVISOR = 60,
    STAFF = 50,
    CASUAL = 40
}

export const ROLE_RANK_MAP: Record<string, number> = {
    DEV: RoleRank.DEV,
    MD: RoleRank.MD,
    DIRECTOR: RoleRank.DIRECTOR,
    HR_MANAGER: RoleRank.HR_MANAGER,
    FINANCE_MANAGER: RoleRank.FINANCE_MANAGER,
    HR_OFFICER: RoleRank.HR_OFFICER,
    IT_MANAGER: RoleRank.IT_MANAGER,
    MANAGER: RoleRank.MANAGER,
    SUPERVISOR: RoleRank.SUPERVISOR,
    STAFF: RoleRank.STAFF,
    CASUAL: RoleRank.CASUAL,

    HR: RoleRank.HR_OFFICER,
    HR_ADMIN: RoleRank.HR_MANAGER,
    IT_ADMIN: RoleRank.IT_MANAGER,
    EMPLOYEE: RoleRank.STAFF,
    SUPER_ADMIN: RoleRank.MD
};
