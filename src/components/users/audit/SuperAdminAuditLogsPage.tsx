// src/components/users/audit/SuperAdminAuditLogsPage.tsx

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { CreateRuleDialog } from "./CreateRuleDialog";
import { DeleteRulesDialog } from "./DeleteRulesDialog";
import { AuditRuleCard } from "./AuditRuleCard";
import { MOCK_AUDIT_RULES } from "./mock/auditRules";
import { MOCK_AUDIT_LOGS } from "./mock/auditLogs";
import type { AuditLog, AuditRule } from "./types";
import { AuditLogsTable } from "./AuditLogsTable";

export const SuperAdminAuditLogsPage: React.FC = () => {
  const [rules, setRules] = useState<AuditRule[]>(MOCK_AUDIT_RULES);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selectedCount = rules.filter((r) => r.selected).length;

  const byCategory = useMemo(() => {
    const g: Record<string, AuditLog[]> = {
      Activity: [],
      Login: [],
      CRUD: [],
      Roles: [],
      Export: [],
    };
    for (const l of MOCK_AUDIT_LOGS) g[l.category].push(l);
    return g;
  }, []);

  const onToggleActive = (id: string, active: boolean) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, active } : r)));

  const onSelect = (id: string) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));

  const onCreate = (rule: AuditRule) => setRules((rs) => [rule, ...rs]);

  const onDelete = () => {
    setRules((rs) => rs.filter((r) => !r.selected));
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Audit Logs</h1>
        <CreateRuleDialog onCreate={onCreate} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-700">Current Alert Rules</h2>

          {/* Only Delete remains here */}
          <Button
            variant="outline"
            disabled={!selectedCount}
            onClick={() => setDeleteOpen(true)}
            className={!selectedCount ? "" : "border-red-600 text-red-600 hover:bg-red-50"}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* Horizontal card layout with section scrolling */}
        <div
          className="
            relative w-full overflow-x-auto overflow-y-hidden pb-2
            scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent scrollbar-thumb-rounded
          "
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="flex gap-4 min-w-max pr-4">
            {rules.map((r) => (
              <AuditRuleCard
                key={r.id}
                rule={r}
                onToggleActive={onToggleActive}
                onSelect={onSelect}
                className="w-[280px] flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </section>

      <Tabs defaultValue="Activity" className="space-y-3">
        <TabsList className="w-full justify-start overflow-x-auto gap-2">
          <TabsTrigger value="Activity" className="px-6">Activity Logs</TabsTrigger>
          <TabsTrigger value="Login" className="px-6">Login</TabsTrigger>
          <TabsTrigger value="CRUD" className="px-6">CRUD Events</TabsTrigger>
          <TabsTrigger value="Roles" className="px-6">Role &amp; Access Changes</TabsTrigger>
          <TabsTrigger value="Export" className="px-6">Data Export</TabsTrigger>
        </TabsList>

        <TabsContent value="Activity">
          <AuditLogsTable logs={byCategory.Activity} />
        </TabsContent>
        <TabsContent value="Login">
          <AuditLogsTable logs={byCategory.Login} />
        </TabsContent>
        <TabsContent value="CRUD">
          <AuditLogsTable logs={byCategory.CRUD} />
        </TabsContent>
        <TabsContent value="Roles">
          <AuditLogsTable logs={byCategory.Roles} />
        </TabsContent>
        <TabsContent value="Export">
          <AuditLogsTable logs={byCategory.Export} />
        </TabsContent>
      </Tabs>

      <DeleteRulesDialog
        open={deleteOpen}
        count={selectedCount}
        onConfirm={onDelete}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
};

export default SuperAdminAuditLogsPage;
