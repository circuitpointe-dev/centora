// src/components/users/announcements/AudienceSelector.tsx

import * as React from "react";
import { Users, Building2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AUDIENCE_LABEL, AudienceType, Tenant } from "./types";

interface AudienceSelectorProps {
  tenants: Tenant[];
  audienceType: AudienceType;
  selectedIds: string[];
  onChangeType: (type: AudienceType) => void;
  onChangeTenantIds: (ids: string[]) => void;
}

export function AudienceSelector({
  tenants,
  audienceType,
  selectedIds,
  onChangeType,
  onChangeTenantIds,
}: AudienceSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(q.toLowerCase())
  );

  const toggleTenant = (id: string, checked: boolean) => {
    if (checked) onChangeTenantIds([...new Set([...selectedIds, id])]);
    else onChangeTenantIds(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm">Audience</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={audienceType === "all" ? "default" : "outline"}
          className={
            audienceType === "all"
              ? "bg-purple-600 hover:bg-purple-700"
              : "border-purple-600 text-purple-600 hover:bg-purple-50"
          }
          onClick={() => onChangeType("all")}
        >
          <Users className="mr-2 h-4 w-4" />
          {AUDIENCE_LABEL.all}
        </Button>
        <Button
          type="button"
          variant={audienceType === "specific" ? "default" : "outline"}
          className={
            audienceType === "specific"
              ? "bg-purple-600 hover:bg-purple-700"
              : "border-purple-600 text-purple-600 hover:bg-purple-50"
          }
          onClick={() => onChangeType("specific")}
        >
          <Building2 className="mr-2 h-4 w-4" />
          {AUDIENCE_LABEL.specific}
        </Button>
        {audienceType === "specific" && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="ml-auto">
                Select Recipients
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <div className="space-y-3">
                <Input
                  placeholder="Search tenants..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <div className="max-h-64 overflow-auto space-y-2 pr-1">
                  {filtered.map((t) => {
                    const checked = selectedIds.includes(t.id);
                    return (
                      <label
                        key={t.id}
                        className="flex items-center gap-2 rounded border px-2 py-1.5 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) =>
                            toggleTenant(t.id, Boolean(v))
                          }
                        />
                        <span className="flex-1">{t.name}</span>
                        <Badge variant="secondary">{t.type}</Badge>
                      </label>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground px-1 py-3">
                      No tenants found.
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setOpen(false)}>Done</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {audienceType === "specific" && selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIds
            .map((id) => tenants.find((t) => t.id === id)?.name || id)
            .map((name) => (
              <Badge key={name} variant="outline" className="truncate">
                {name}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
