import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */
export type Permission = "create" | "read" | "update" | "delete" | "export" | "upload";

type Feature = {
  id: string;
  name: string;
  permissions: Permission[];
};

type ModuleAccess = {
  id: string;
  name: string;
  features: Feature[];
};

export type AccessMap = {
  [moduleId: string]: {
    [featureId: string]: Permission[];
  };
};

export type AddUserPayload = {
  fullName: string;
  email: string;
  department: string;
  roles: string[];
  access: AccessMap;
  message?: string;
};

/* ---------- Validation ---------- */
const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  department: z.string().min(1, "Select a department"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  message: z.string().optional(),
});

/* ---------- Mock data (replace with Supabase later) ---------- */
const MOCK_DEPARTMENTS = ["Program management", "Finance control", "HR management", "Inventory management"];

const MOCK_ROLES = [
  { id: "org_admin", name: "Admin" },
  { id: "contrib", name: "Contributor" },
  { id: "editor", name: "Editor" },
  { id: "viewer", name: "Viewer" },
];

const MOCK_SUBSCRIBED_MODULES: ModuleAccess[] = [
  {
    id: "fundraising",
    name: "Fundraising",
    features: [
      { id: "dashboard", name: "Dashboard", permissions: ["read"] },
      { id: "active-grants", name: "Active grants", permissions: ["create", "read", "update", "delete", "export", "upload"] },
      { id: "grantee-submissions", name: "Grantee submissions", permissions: ["create", "read", "update", "delete", "export", "upload"] },
      { id: "templates", name: "Templates", permissions: ["create", "read", "update", "delete", "export"] },
      { id: "grants-archive", name: "Grants archive", permissions: ["read", "export"] },
    ],
  },
  {
    id: "documents",
    name: "Documents",
    features: [
      { id: "documents", name: "Documents", permissions: ["create", "read", "update", "delete", "upload"] },
      { id: "templates", name: "Templates", permissions: ["create", "read", "update", "delete", "export"] },
      { id: "e-signature", name: "E-Signature", permissions: ["create", "read", "update"] },
      { id: "compliance", name: "Compliance", permissions: ["read"] },
    ],
  },
  {
    id: "grants",
    name: "Grants",
    features: [
      { id: "grants-manager", name: "Grants manager", permissions: ["create", "read", "update", "delete", "export", "upload"] },
      { id: "reports-submissions", name: "Report submissions", permissions: ["read", "update", "export"] },
    ],
  },
];

/* ---------- Roles multi-select ---------- */
const RolesMultiSelect: React.FC<{
  value: string[];
  onChange: (v: string[]) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder = "Select role(s)" }) => {
  const selected = useMemo(() => options.filter((o) => value.includes(o.id)), [options, value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between">
          <div className="truncate text-left">
            {selected.length ? (
              <div className="flex flex-wrap gap-1">
                {selected.map((r) => (
                  <Badge key={r.id} variant="secondary" className="font-normal">{r.name}</Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[320px]">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandEmpty>No roles found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((opt) => {
                const checked = value.includes(opt.id);
                return (
                  <CommandItem
                    key={opt.id}
                    onSelect={() => onChange(checked ? value.filter((v) => v !== opt.id) : [...value, opt.id])}
                    className="flex items-center justify-between"
                  >
                    <span>{opt.name}</span>
                    {checked && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ---------- Main form ---------- */
interface AddUserFormProps {
  onSubmit: (payload: AddUserPayload) => void;
  onCancel: () => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AddUserPayload>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", department: "", roles: [], access: {}, message: "" },
  });

  // inline add dept/role
  const [departments, setDepartments] = useState<string[]>(MOCK_DEPARTMENTS);
  const [rolesOpts, setRolesOpts] = useState(MOCK_ROLES);
  const [newDept, setNewDept] = useState("");
  const [newRole, setNewRole] = useState("");

  const roles = watch("roles");
  const access = watch("access") as AccessMap; // nested object

  /* ----- Access helpers ----- */
  const isPermChecked = (moduleId: string, featureId: string, perm: Permission) =>
    Boolean(access?.[moduleId]?.[featureId]?.includes(perm));

  const togglePerm = (moduleId: string, featureId: string, perm: Permission) => {
    const current = access?.[moduleId]?.[featureId] ?? ([] as Permission[]);
    const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
    setValue("access", {
      ...access,
      [moduleId]: {
        ...(access?.[moduleId] ?? {}),
        [featureId]: next,
      },
    });
  };

  const setAllForFeature = (moduleId: string, featureId: string, perms: Permission[], checked: boolean) => {
    setValue("access", {
      ...access,
      [moduleId]: {
        ...(access?.[moduleId] ?? {}),
        [featureId]: checked ? perms : [],
      },
    });
  };

  /* ----- inline add ----- */
  const addDepartment = () => {
    const v = newDept.trim();
    if (!v) return;
    setDepartments((d) => [...d, v]);
    setValue("department", v);
    setNewDept("");
    // TODO: persist to Supabase
  };

  const addRole = () => {
    const v = newRole.trim();
    if (!v) return;
    const newOpt = { id: v.toLowerCase().replace(/\s+/g, "_"), name: v };
    setRolesOpts((r) => [...r, newOpt]);
    setValue("roles", [...roles, newOpt.id]);
    setNewRole("");
    // TODO: persist to Supabase
  };

  /* ----- submit ----- */
  const onValid = (payload: AddUserPayload) => onSubmit(payload);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      {/* User Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">User Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Full Name</Label>
            <Input {...register("fullName")} placeholder="John Doe" className="mt-1" />
            {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <Input type="email" {...register("email")} placeholder="john@example.org" className="mt-1" />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Department */}
          <div>
            <Label className="text-sm text-gray-600">Department</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-between mt-1">
                  {watch("department") || <span className="text-muted-foreground">Select department</span>}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0">
                <Command>
                  <CommandInput placeholder="Search departments..." />
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {departments.map((d) => (
                        <CommandItem key={d} onSelect={() => setValue("department", d)}>
                          {d}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>}
            <div className="flex mt-2 gap-2">
              <Input value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="New department" />
              <Button type="button" variant="outline" onClick={addDepartment}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Roles */}
          <div>
            <Label className="text-sm text-gray-600">Role(s)</Label>
            <div className="mt-1">
              <RolesMultiSelect
                value={roles}
                onChange={(v) => setValue("roles", v)}
                options={rolesOpts}
                placeholder="Select role(s)"
              />
            </div>
            {errors.roles && <p className="text-sm text-red-500 mt-1">{errors.roles.message}</p>}
            <div className="flex mt-2 gap-2">
              <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="New role" />
              <Button type="button" variant="outline" onClick={addRole}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ACCESS (Accordion with feature cards + CRUD chips) */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Access</h3>
        <Accordion type="multiple" className="rounded-lg border">
          {MOCK_SUBSCRIBED_MODULES.map((mod) => (
            <AccordionItem key={mod.id} value={mod.id} className="border-b">
              <AccordionTrigger className="px-4">
                <span className="text-sm font-medium">{mod.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                  {mod.features.map((feat) => {
                    const supported = feat.permissions;
                    const granted = access?.[mod.id]?.[feat.id] ?? [];
                    const allChecked = granted.length > 0 && supported.every((p) => granted.includes(p));

                    return (
                      <Card key={feat.id} className="shadow-none">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">{feat.name}</div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={allChecked}
                                onCheckedChange={(c) => setAllForFeature(mod.id, feat.id, supported, Boolean(c))}
                                aria-label="Select all permissions"
                              />
                              <span className="text-xs text-gray-500">Select all</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {supported.map((perm) => (
                              <label
                                key={perm}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-md px-2 py-1 border text-xs",
                                  isPermChecked(mod.id, feat.id, perm)
                                    ? "bg-violet-50 border-violet-200 text-violet-900"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                )}
                              >
                                <Checkbox
                                  checked={isPermChecked(mod.id, feat.id, perm)}
                                  onCheckedChange={() => togglePerm(mod.id, feat.id, perm)}
                                />
                                <span className="capitalize">{perm}</span>
                              </label>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Optional message */}
      <div>
        <Label className="text-sm text-gray-600">Optional message</Label>
        <Textarea {...register("message")} placeholder="Add a short message to include in the invitation…" className="resize-none" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
          Review Invite
        </Button>
      </div>
    </form>
  );
};

/* ---------- Preview component (exported here for convenience) ---------- */
export const UserInvitePreview: React.FC<{
  invite: AddUserPayload;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ invite, onBack, onConfirm }) => {
  const modules = Object.keys(invite.access || {});
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900">User Info</h3>
        <p><strong>Name:</strong> {invite.fullName}</p>
        <p><strong>Email:</strong> {invite.email}</p>
        <p><strong>Department:</strong> {invite.department}</p>
        <p><strong>Roles:</strong> {invite.roles.join(", ")}</p>
        {invite.message && <p><strong>Message:</strong> {invite.message}</p>}
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Access Summary</h4>
        {modules.length === 0 && <p className="text-sm text-gray-500">No explicit permissions selected.</p>}
        {modules.map((modId) => {
          const features = Object.keys(invite.access[modId] || {});
          return (
            <div key={modId} className="text-sm">
              <div className="font-medium">{modId}</div>
              <ul className="list-disc ml-5">
                {features.map((featId) => (
                  <li key={featId}>
                    <span className="font-medium">{featId}</span>: {invite.access[modId][featId].join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button className="bg-violet-600 text-white" onClick={onConfirm}>Confirm & Send Invite</Button>
      </div>
    </div>
  );
};
