// src/components/users/super-admin/SuperAdminFilter.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import type { SuperAdminRole } from "./types";

export type SuperAdminFilters = {
  statuses: Array<"active" | "suspended" | "pending">;
  roles: string[];
};

const BRAND_PURPLE_OUTLINE =
  "border border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100";
const BRAND_PURPLE = "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";

const STATUS_OPTIONS: Array<"active" | "suspended" | "pending"> = [
  "active",
  "suspended",
  "pending",
];

export function SuperAdminFilter({
  roles,
  value,
  onChange,
  onApply,
  onClear,
}: {
  roles: string[];
  value: SuperAdminFilters;
  onChange: (next: SuperAdminFilters) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const count = value.statuses.length + value.roles.length;

  const toggleStatus = (s: "active" | "suspended" | "pending", checked: boolean) => {
    const next = new Set(value.statuses);
    checked ? next.add(s) : next.delete(s);
    onChange({ ...value, statuses: Array.from(next) as any });
  };

  const toggleRole = (r: string, checked: boolean) => {
    const next = new Set(value.roles);
    checked ? next.add(r) : next.delete(r);
    onChange({ ...value, roles: Array.from(next) });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`${BRAND_PURPLE_OUTLINE} relative`}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {count > 0 && (
            <Badge className="ml-2 h-5 rounded px-1.5 text-[10px] bg-purple-600 text-white hover:bg-purple-600">
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </div>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <label key={s} className="flex items-center gap-2 rounded border px-2 py-1.5 text-sm">
                  <Checkbox
                    checked={value.statuses.includes(s)}
                    onCheckedChange={(v) => toggleStatus(s, Boolean(v))}
                  />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Roles
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <label key={r} className="flex items-center gap-2 rounded border px-2 py-1.5 text-sm">
                  <Checkbox
                    checked={value.roles.includes(r)}
                    onCheckedChange={(v) => toggleRole(r, Boolean(v))}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClear();
              }}
            >
              Clear
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className={BRAND_PURPLE_OUTLINE}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                type="button"
                className={BRAND_PURPLE}
                onClick={() => {
                  onApply();
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
