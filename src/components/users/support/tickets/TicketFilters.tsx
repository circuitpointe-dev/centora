// src/components/support/tickets/TicketFilters.tsx

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketPriority, TicketStatus } from "./TicketTypes";
import { FilterState } from "./TicketToolbar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const ALL = "All";

export function TicketFilters({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: FilterState;
  onChange: (fs: FilterState) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(value);

  const statuses: TicketStatus[] = ["Open", "In Progress", "Resolved", "Closed"];
  const priorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];
  const categories = [ALL, "Access", "Billing", "Technical", "Other"];
  const assignees = [ALL, "Unassigned", "Amara Okoye", "Dele Akin", "Yemi Alade"];
  const tenants = [ALL, "NimbusPay", "QuickMart", "BlueCargo", "FarmLink"];

  return (
    <Dialog open={open} onOpenChange={(v) => { setDraft(value); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Filter Tickets</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => {
                const isOn = draft.status.includes(s);
                return (
                  <Badge
                    key={s}
                    variant={isOn ? "default" : "outline"}
                    className={
                      (isOn ? "bg-purple-600 hover:bg-purple-700" : "") +
                      " cursor-pointer select-none"
                    }
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        status: isOn ? d.status.filter((x) => x !== s) : [...d.status, s],
                      }))
                    }
                  >
                    {s}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {priorities.map((p) => {
                const isOn = draft.priority.includes(p);
                return (
                  <Badge
                    key={p}
                    variant={isOn ? "default" : "outline"}
                    className={
                      (isOn ? "bg-purple-600 hover:bg-purple-700" : "") +
                      " cursor-pointer select-none"
                    }
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        priority: isOn ? d.priority.filter((x) => x !== p) : [...d.priority, p],
                      }))
                    }
                  >
                    {p}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={draft.category} onValueChange={(v) => setDraft((d) => ({ ...d, category: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Assignee</Label>
            <Select value={draft.assignee} onValueChange={(v) => setDraft((d) => ({ ...d, assignee: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {assignees.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tenant</Label>
            <Select value={draft.tenant} onValueChange={(v) => setDraft((d) => ({ ...d, tenant: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tenants.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            className="px-3 py-2 rounded-md border text-sm"
            onClick={() => { setDraft(value); onOpenChange(false); }}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 rounded-md text-white text-sm bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            onClick={() => { onChange(draft); onOpenChange(false); }}
          >
            Apply Filters
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}