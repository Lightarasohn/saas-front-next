export const ROLES = {
    USER: "User",
    ADMIN: "Admin",
    SUPER_ADMIN: "SuperAdmin",
};

export function hasRole(user, ...allowed) {
    return allowed.includes(user?.roleName);
}