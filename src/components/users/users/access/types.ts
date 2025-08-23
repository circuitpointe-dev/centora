// src/components/users/access/types.ts
export type ModuleKey =
    | "fundraising" | "grants" | "documents" | "programmes"
    | "procurement" | "inventory" | "finance" | "lms"
    | "hr" | "user_mgmt";

export type Crud = { create: boolean; read: boolean; update: boolean; delete: boolean };

export type Capability = "approve" | "export" | "manage_settings" | "assign_roles";

export type ModuleRole = {
    id: string;
    module: ModuleKey;
    name: string;                          // Admin | Owner | Contributor | Viewer | ...
    description?: string;
    crud: Crud;
    caps?: Partial<Record<Capability, boolean>>;
    system?: boolean;
};

// ---- Access map that your current AddUserForm already expects ----
// Per-module object that your zod schema can validate:
//   { _module: boolean, _role?: string, create?: boolean, read?: boolean, ... }
export type AccessMap = Record<string, Record<string, boolean | string | string[]>>;
