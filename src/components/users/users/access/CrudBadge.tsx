// src/components/users/access/CrudBadge.tsx
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { Crud } from "@/components/users/users/access/types";

type Props = { crud: Crud };

export const CrudBadge: React.FC<Props> = ({ crud }) => {
  const items: [keyof Crud, string][] = [
    ["create", "C"],
    ["read", "R"],
    ["update", "U"],
    ["delete", "D"],
  ];

  return (
    <div className="flex gap-1 flex-wrap">
      {items.map(([k, label]) => {
        const active = Boolean(crud[k]);
        return (
          <Badge
            key={k}
            // Active = brand purple, Inactive = subtle gray
            className={
              "rounded-sm text-[10px] px-1.5 py-0.5 " +
              (active
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600")
            }
          >
            {label}
          </Badge>
        );
      })}
    </div>
  );
};
