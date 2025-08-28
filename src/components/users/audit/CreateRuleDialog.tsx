// src/components/users/audit/CreateRuleDialog.tsx

import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AuditRule, AlertActionType, AlertMethod } from "./types";

type Props = {
  onCreate: (rule: AuditRule) => void;
};

const ACTION_TYPES: AlertActionType[] = [
  "Permission Change",
  "Failed Login Attempts",
  "NGO Deletion",
  "Role Update",
  "Data Export",
  "CRUD Event",
];

const METHODS: AlertMethod[] = ["Email", "Email + Banner", "Slack Alert", "Webhook"];

export const CreateRuleDialog: React.FC<Props> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    actionType: "Permission Change" as AlertActionType,
    threshold: "Any",
    alertMethod: "Email" as AlertMethod,
    active: true,
  });

  const handleSubmit = () => {
    const newRule: AuditRule = {
      id: `r_${Date.now()}`,
      ...form,
    };
    onCreate(newRule);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">+ Create New Rule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Action Type</Label>
            <div className="col-span-3">
              <Select
                value={form.actionType}
                onValueChange={(v) => setForm((f) => ({ ...f, actionType: v as AlertActionType }))}
              >
                <SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Threshold</Label>
            <Input
              className="col-span-3"
              value={form.threshold}
              onChange={(e) => setForm((f) => ({ ...f, threshold: e.target.value }))}
              placeholder="e.g. > 5 in 1 hour"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Alert Method</Label>
            <div className="col-span-3">
              <Select
                value={form.alertMethod}
                onValueChange={(v) => setForm((f) => ({ ...f, alertMethod: v as AlertMethod }))}
              >
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  {METHODS.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right">Active</Label>
            <div className="col-span-3">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, active: Boolean(v) }))}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit}>Create Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
