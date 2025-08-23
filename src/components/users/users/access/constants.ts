// src/components/users/access/constants.ts
import type { ModuleKey, ModuleRole, Capability } from "@/components/users/users/access/types";

export const MODULES: { key: ModuleKey; label: string }[] = [
    { key: "fundraising", label: "Fundraising" },
    { key: "grants", label: "Grants Management" },
    { key: "documents", label: "Documents Manager" },
    { key: "programmes", label: "Programme Management" },
    { key: "procurement", label: "Procurement" },
    { key: "inventory", label: "Inventory Management" },
    { key: "finance", label: "Finance & Control" },
    { key: "lms", label: "Learning Management" },
    { key: "hr", label: "HR Management" },
    { key: "user_mgmt", label: "User Management" },
];

export const MODULE_LABEL: Record<ModuleKey, string> =
    Object.fromEntries(MODULES.map(m => [m.key, m.label])) as Record<ModuleKey, string>;

function role(
    module: ModuleKey,
    id: string,
    name: string,
    crud: { c: boolean; r: boolean; u: boolean; d: boolean },
    caps?: Partial<Record<Capability, boolean>>,
): ModuleRole {
    return {
        module,
        id,
        name,
        crud: { create: crud.c, read: crud.r, update: crud.u, delete: crud.d },
        caps,
        system: true,
    };
}

export const seedRolesByModule: Record<ModuleKey, ModuleRole[]> = {
    fundraising: [
        role("fundraising", "fundraising_admin", "Admin", { c: true, r: true, u: true, d: true }, { approve: true, export: true, manage_settings: true, assign_roles: true }),
        role("fundraising", "fundraising_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("fundraising", "fundraising_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("fundraising", "fundraising_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    grants: [
        role("grants", "grants_admin", "Admin", { c: true, r: true, u: true, d: true }, { approve: true, export: true, manage_settings: true, assign_roles: true }),
        role("grants", "grants_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("grants", "grants_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("grants", "grants_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    documents: [
        role("documents", "docs_admin", "Admin", { c: true, r: true, u: true, d: true }, { export: true, manage_settings: true, assign_roles: true }),
        role("documents", "docs_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("documents", "docs_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("documents", "docs_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    programmes: [
        role("programmes", "prog_admin", "Admin", { c: true, r: true, u: true, d: true }, { manage_settings: true, assign_roles: true }),
        role("programmes", "prog_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("programmes", "prog_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("programmes", "prog_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    procurement: [
        role("procurement", "proc_admin", "Admin", { c: true, r: true, u: true, d: true }, { approve: true, manage_settings: true, assign_roles: true }),
        role("procurement", "proc_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("procurement", "proc_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("procurement", "proc_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    inventory: [
        role("inventory", "inv_admin", "Admin", { c: true, r: true, u: true, d: true }, { manage_settings: true, assign_roles: true }),
        role("inventory", "inv_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("inventory", "inv_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("inventory", "inv_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    finance: [
        role("finance", "fin_admin", "Admin", { c: true, r: true, u: true, d: true }, { approve: true, export: true, manage_settings: true, assign_roles: true }),
        role("finance", "fin_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("finance", "fin_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("finance", "fin_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    lms: [
        role("lms", "lms_admin", "Admin", { c: true, r: true, u: true, d: true }, { manage_settings: true, assign_roles: true }),
        role("lms", "lms_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("lms", "lms_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("lms", "lms_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    hr: [
        role("hr", "hr_admin", "Admin", { c: true, r: true, u: true, d: true }, { manage_settings: true, assign_roles: true }),
        role("hr", "hr_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("hr", "hr_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("hr", "hr_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
    user_mgmt: [
        role("user_mgmt", "users_admin", "Admin", { c: true, r: true, u: true, d: true }, { assign_roles: true, manage_settings: true }),
        role("user_mgmt", "users_owner", "Owner", { c: true, r: true, u: true, d: true }),
        role("user_mgmt", "users_contrib", "Contributor", { c: true, r: true, u: true, d: false }),
        role("user_mgmt", "users_view", "Viewer", { c: false, r: true, u: false, d: false }),
    ],
};
