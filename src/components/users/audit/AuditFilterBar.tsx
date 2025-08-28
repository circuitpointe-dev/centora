// src/components/users/audit/AuditFilterBar.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { AuditFilterState } from "./types";

type Props = {
  filter: AuditFilterState;
  setFilter: (fn: (f: AuditFilterState) => AuditFilterState) => void;
  onExport: () => void;
  actionsUniverse: string[];
  usersUniverse: string[];
  orgUniverse: string[];
};

export const AuditFilterBar: React.FC<Props> = ({
  filter,
  setFilter,
  onExport,
  actionsUniverse,
  usersUniverse,
  orgUniverse,
}) => {
  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((a) => a !== value) : [...arr, value];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600">Audit Logs</span>
        <div className="w-64">
          <Input
            placeholder="Search logs..."
            value={filter.q}
            onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple/10">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[620px] p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">Actions</Label>
                <div className="mt-2 max-h-44 space-y-2 overflow-auto rounded border p-2">
                  {actionsUniverse.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filter.actions.includes(a)}
                        onCheckedChange={() =>
                          setFilter((f) => ({ ...f, actions: toggle(f.actions, a) }))
                        }
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Users</Label>
                <div className="mt-2 max-h-44 space-y-2 overflow-auto rounded border p-2">
                  {usersUniverse.map((u) => (
                    <label key={u} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filter.users.includes(u)}
                        onCheckedChange={() =>
                          setFilter((f) => ({ ...f, users: toggle(f.users, u) }))
                        }
                      />
                      <span>{u}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-zinc-500">Organizations</Label>
                <div className="mt-2 max-h-44 space-y-2 overflow-auto rounded border p-2">
                  {orgUniverse.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filter.organizations.includes(o)}
                        onCheckedChange={() =>
                          setFilter((f) => ({ ...f, organizations: toggle(f.organizations, o) }))
                        }
                      />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-zinc-500">From</Label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded border px-2 py-1 text-sm"
                      value={filter.dateFrom || ""}
                      onChange={(e) => setFilter((f) => ({ ...f, dateFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-500">To</Label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded border px-2 py-1 text-sm"
                      value={filter.dateTo || ""}
                      onChange={(e) => setFilter((f) => ({ ...f, dateTo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                onClick={() =>
                  setFilter(() => ({
                    q: "",
                    category: "All",
                    users: [],
                    organizations: [],
                    actions: [],
                    dateFrom: undefined,
                    dateTo: undefined,
                  }))
                }
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Keep this Export, style with brand purple */}
        <Button
          onClick={onExport}
          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

