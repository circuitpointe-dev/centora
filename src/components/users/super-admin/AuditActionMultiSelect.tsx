// src/components/users/super-admin/AuditActionMultiSelect.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, X, Search } from "lucide-react";
import type { AuditAction } from "./types";

type Option = { value: AuditAction; label: string };

const ACTION_LABEL: Record<AuditAction, string> = {
  USER_CREATED: "User Created",
  USER_UPDATED: "User Updated",
  USER_SUSPENDED: "User Suspended",
  USER_ACTIVATED: "User Activated",
  PASSWORD_RESET_SENT: "Password Reset Sent",
  INVITE_SENT: "Invitation Sent",
  LOGIN: "Login",
  ROLE_CHANGED: "Role Changed",
  STATUS_CHANGED: "Status Changed",
};

export function makeActionOptions(): Option[] {
  return (Object.keys(ACTION_LABEL) as AuditAction[]).map((v) => ({
    value: v,
    label: ACTION_LABEL[v],
  }));
}

export function AuditActionMultiSelect({
  value,
  onChange,
  options = makeActionOptions(),
  placeholder = "Actions",
  maxChips = 2,
}: {
  value: AuditAction[];
  onChange: (next: AuditAction[]) => void;
  options?: Option[];
  placeholder?: string;
  /** number of selected labels to render before collapsing to +N */
  maxChips?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const selected = new Set(value);
  const filtered = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return options;
    return options.filter((o) => o.label.toLowerCase().includes(t));
  }, [q, options]);

  const toggle = (v: AuditAction, checked: boolean) => {
    const next = new Set(selected);
    checked ? next.add(v) : next.delete(v);
    onChange(Array.from(next));
  };

  const clearAll = () => onChange([]);

  // Compose trigger label
  const selectedOpts = options.filter((o) => selected.has(o.value));
  const chips = selectedOpts.slice(0, maxChips).map((o) => o.label);
  const extra = Math.max(0, selectedOpts.length - chips.length);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          title={selectedOpts.map((o) => o.label).join(", ") || placeholder}
        >
          <div className="flex min-w-0 items-center gap-1">
            {selectedOpts.length === 0 ? (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex min-w-0 items-center gap-1">
                {chips.map((label) => (
                  <Badge key={label} variant="secondary" className="max-w-[120px] truncate">
                    {label}
                  </Badge>
                ))}
                {extra > 0 && (
                  <Badge variant="secondary" className="shrink-0">
                    +{extra}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search Actions..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-64 space-y-1 overflow-auto p-2">
          {filtered.map((o) => {
            const isChecked = selected.has(o.value);
            return (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(v) => toggle(o.value, Boolean(v))}
                />
                <span className="truncate">{o.label}</span>
              </label>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-2 text-xs text-muted-foreground">No Matches.</div>
          )}
        </div>

        <div className="flex items-center justify-between border-t p-2">
          <Button
            type="button"
            variant="ghost"
            className="gap-1"
            onClick={clearAll}
            disabled={selected.size === 0}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
