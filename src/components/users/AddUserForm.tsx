import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** ---- Mock data (replace with Supabase later) ---- */
const MOCK_DEPARTMENTS = [
  "Program management",
  "Finance control",
  "HR management",
  "Inventory management",
];

const MOCK_ROLES = [
  { id: "org_admin", name: "Admin" },
  { id: "contrib", name: "Contributor" },
  { id: "editor", name: "Editor" },
  { id: "viewer", name: "Viewer" },
];

type Permission = "create" | "read" | "update" | "delete" | "export" | "upload";

type Feature = {
  id: string;
  name: string;
  permissions: Permission[]; // what this feature supports
};

type ModuleAccess = {
  id: string;
  name: string;
  features: Feature[];
};

const MOCK_SUBSCRIBED_MODULES: ModuleAccess[] = [
  {
    id: "fundraising",
    name: "Fundraising",
    features: [
      {
        id: "dashboard",
        name: "Dashboard",
        permissions: ["read"],
      },
      {
        id: "active-grants",
        name: "Active grants",
        permissions: ["create", "read", "update", "delete", "export", "upload"],
      },
      {
        id: "grantee-submissions",
        name: "Grantee submissions",
        permissions: ["create", "read", "update", "delete", "export", "upload"],
      },
      {
        id: "templates",
        name: "Templates",
        permissions: ["create", "read", "update", "delete", "export"],
      },
      {
        id: "grants-archive",
        name: "Grants archive",
        permissions: ["read", "export"],
      },
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

/** ---- Types for payload ---- */
export type AddUserPayload = {
  fullName: string;
  email: string;
  department?: string;
  roles: string[]; // role ids
  access: {
    [moduleId: string]: {
      [featureId: string]: Permission[]; // granted perms
    };
  };
  message?: string;
};

interface AddUserFormProps {
  onSubmit: (payload: AddUserPayload) => void;
  onCancel: () => void;
}

/** Simple multi-select built from Popover + Command (shadcn) */
const RolesMultiSelect: React.FC<{
  value: string[];
  onChange: (v: string[]) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder = "Select roles" }) => {
  const selected = useMemo(
    () => options.filter((o) => value.includes(o.id)),
    [options, value]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          <div className="truncate text-left">
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selected.map((r) => (
                  <Badge key={r.id} variant="secondary" className="font-normal">
                    {r.name}
                  </Badge>
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
                    onSelect={() => {
                      onChange(
                        checked
                          ? value.filter((v) => v !== opt.id)
                          : [...value, opt.id]
                      );
                    }}
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

export const AddUserForm: React.FC<AddUserFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  /** ----- Form state ----- */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  /** Access state: module -> feature -> granted permissions[] */
  const [access, setAccess] = useState<AddUserPayload["access"]>({});

  /** Helpers */
  const togglePerm = (
    moduleId: string,
    featureId: string,
    perm: Permission
  ) => {
    setAccess((prev) => {
      const currentFeaturePerms =
        prev?.[moduleId]?.[featureId] ?? ([] as Permission[]);
      const exists = currentFeaturePerms.includes(perm);
      const next = exists
        ? currentFeaturePerms.filter((p) => p !== perm)
        : [...currentFeaturePerms, perm];

      return {
        ...prev,
        [moduleId]: {
          ...(prev[moduleId] ?? {}),
          [featureId]: next,
        },
      };
    });
  };

  const setAllForFeature = (
    moduleId: string,
    featureId: string,
    perms: Permission[],
    checked: boolean
  ) => {
    setAccess((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] ?? {}),
        [featureId]: checked ? perms : [],
      },
    }));
  };

  const isPermChecked = (
    moduleId: string,
    featureId: string,
    perm: Permission
  ) => {
    return access?.[moduleId]?.[featureId]?.includes(perm) ?? false;
  };

  const validate = () => {
    if (!fullName.trim()) return "Full name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return "A valid email is required";
    if (roles.length === 0) return "Select at least one role";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      // You can swap to your toast
      alert(err);
      return;
    }
    const payload: AddUserPayload = {
      fullName,
      email,
      department: department || undefined,
      roles,
      access,
      message: message || undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Details */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">User Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.org"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm text-gray-600">Department</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between mt-1"
                  >
                    {department || (
                      <span className="text-muted-foreground">
                        Select department
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <Command>
                    <CommandInput placeholder="Search departments..." />
                    <CommandEmpty>No department found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {MOCK_DEPARTMENTS.map((d) => (
                          <CommandItem
                            key={d}
                            onSelect={() => setDepartment(d)}
                          >
                            {d}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Role(s)</Label>
              <div className="mt-1">
                <RolesMultiSelect
                  value={roles}
                  onChange={setRoles}
                  options={MOCK_ROLES}
                  placeholder="Select role(s)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Access */}
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
                      const allSupported = feat.permissions;
                      const granted = access?.[mod.id]?.[feat.id] ?? [];
                      const allChecked =
                        granted.length > 0 &&
                        allSupported.every((p) => granted.includes(p));
                      const someChecked =
                        granted.length > 0 && !allChecked;

                      return (
                        <Card key={feat.id} className="shadow-none">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-900">
                                {feat.name}
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={allChecked}
                                  onCheckedChange={(c) =>
                                    setAllForFeature(
                                      mod.id,
                                      feat.id,
                                      allSupported,
                                      Boolean(c)
                                    )
                                  }
                                  aria-label="Select all permissions"
                                />
                                <span className="text-xs text-gray-500">
                                  Select all
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {allSupported.map((perm) => (
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
                                    checked={isPermChecked(
                                      mod.id,
                                      feat.id,
                                      perm
                                    )}
                                    onCheckedChange={() =>
                                      togglePerm(mod.id, feat.id, perm)
                                    }
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
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Optional message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a short message to include in the invitation…"
              className="resize-none"
            />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
            Send Invite
          </Button>
        </div>
      </form>
    </div>
  );
};
