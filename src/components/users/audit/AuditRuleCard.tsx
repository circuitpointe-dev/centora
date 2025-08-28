// src/components/users/audit/AuditRuleCard.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AuditRule } from "./types";

type Props = {
  rule: AuditRule;
  onToggleActive: (id: string, active: boolean) => void;
  onSelect: (id: string) => void; // click-to-select on the whole card
  className?: string;
};

export const AuditRuleCard: React.FC<Props> = ({
  rule,
  onToggleActive,
  onSelect,
  className,
}) => {
  return (
    <Card
      onClick={() => onSelect(rule.id)}
      className={cn(
        "relative cursor-pointer transition border shadow-sm",
        rule.selected
          ? "border-brand-purple ring-1 ring-brand-purple"
          : "hover:border-zinc-400",
        className
      )}
    >
      <CardContent className="p-4 space-y-3">
        <Row label="Action Type" value={rule.actionType} />
        <Row label="Threshold" value={rule.threshold} />
        <Row label="Alert Method" value={rule.alertMethod} />
        <Row
          label="Status"
          value={
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                rule.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-zinc-100 text-zinc-600"
              )}
            >
              {rule.active ? "Active" : "Disabled"}
            </span>
          }
        />
        <Row
          label="Action"
          value={
            <Switch
              checked={rule.active}
              onCheckedChange={(v) => onToggleActive(rule.id, Boolean(v))}
              className="data-[state=checked]:bg-brand-purple"
              onClick={(e) => e.stopPropagation()} // keep card selection intact
            />
          }
        />
      </CardContent>
    </Card>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
