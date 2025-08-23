// src/components/users/access/AccessSection.tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { MODULES, MODULE_LABEL, seedRolesByModule } from "@/components/users/users/access/constants";
import { ModuleRoleSelect } from "@/components/users/users/access/ModuleRoleSelect";
import { CrudBadge } from "@/components/users/users/access/CrudBadge";
import type { AccessMap, ModuleKey } from "@/components/users/users/access/types";

export type { AccessMap } from "@/components/users/users/access/types";

type Props = {
  value: AccessMap;
  onChange: (next: AccessMap) => void;
};

type RowState = { enabled: boolean; roleId: string };

const getRowStateFromValue = (value: AccessMap, m: ModuleKey): RowState => {
  const mod = value[m] ?? {};
  const enabled = Boolean(mod._module);
  const roleId = typeof mod._role === "string" ? (mod._role as string) : "";
  return { enabled, roleId };
};

const applyRoleToModuleObject = (module: ModuleKey, roleId: string) => {
  const role = seedRolesByModule[module].find((r) => r.id === roleId);
  if (!role) return {};
  const base: Record<string, boolean | string> = {
    _module: true,
    _role: roleId,
    create: role.crud.create,
    read: role.crud.read,
    update: role.crud.update,
    delete: role.crud.delete,
  };
  if (role.caps) {
    for (const [k, v] of Object.entries(role.caps)) base[k] = Boolean(v);
  }
  return base;
};

export const AccessSection: React.FC<Props> = ({ value, onChange }) => {
  React.useEffect(() => {
    const next: AccessMap = { ...value };
    let changed = false;
    for (const { key } of MODULES) {
      if (!next[key]) {
        next[key] = { _module: false };
        changed = true;
      }
    }
    if (changed) onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setModuleEnabled = (module: ModuleKey, enabled: boolean) => {
    const next: AccessMap = { ...value, [module]: { ...(value[module] ?? {}) } };
    next[module]._module = enabled;
    if (!enabled) {
      delete next[module]._role;
      delete next[module].create;
      delete next[module].read;
      delete next[module].update;
      delete next[module].delete;
    }
    onChange(next);
  };

  const setModuleRole = (module: ModuleKey, roleId: string) => {
    const next: AccessMap = { ...value };
    next[module] = {
      ...(value[module] ?? {}),
      ...applyRoleToModuleObject(module, roleId),
    };
    onChange(next);
  };

  const getCrud = (module: ModuleKey, roleId?: string) => {
    const r = seedRolesByModule[module].find((x) => x.id === roleId);
    return r?.crud ?? { create: false, read: false, update: false, delete: false };
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Access</h3>
      <Card className="shadow-sm border-violet-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 h-9">
                <TableHead className="w-[28%] py-1.5">Module</TableHead>
                <TableHead className="w-[14%] py-1.5">Enabled</TableHead>
                <TableHead className="w-[30%] py-1.5">Role</TableHead>
                <TableHead className="w-[28%] py-1.5">CRUD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map(({ key }) => {
                const { enabled, roleId } = getRowStateFromValue(value, key);
                return (
                  <TableRow
                    key={key}
                    className="h-9 hover:bg-violet-50/30 transition-colors"
                  >
                    <TableCell className="py-1.5 font-medium">
                      <div className="truncate max-w-[200px]" title={MODULE_LABEL[key]}>
                        {MODULE_LABEL[key]}
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Switch
                        checked={enabled}
                        onCheckedChange={(v) => setModuleEnabled(key, v)}
                        className="data-[state=checked]:bg-violet-600"
                      />
                    </TableCell>
                    <TableCell className="py-1.5">
                      <div className="focus-within:ring-2 focus-within:ring-violet-600 rounded-md">
                        <ModuleRoleSelect
                          value={roleId}
                          onChange={(id) => setModuleRole(key, id)}
                          roles={seedRolesByModule[key]}
                          disabled={!enabled}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <CrudBadge crud={getCrud(key, roleId)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
