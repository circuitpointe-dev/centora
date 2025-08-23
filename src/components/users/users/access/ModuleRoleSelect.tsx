// src/components/users/access/ModuleRoleSelect.tsx
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ModuleRole } from "@/components/users/users/access/types";

type Props = {
  value: string;
  onChange: (roleId: string) => void;
  roles: ModuleRole[];
  disabled?: boolean;
};

export const ModuleRoleSelect: React.FC<Props> = ({ value, onChange, roles, disabled }) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((r) => (
          <SelectItem key={r.id} value={r.id}>
            {r.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
