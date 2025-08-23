// src/components/users/AddUserForm.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DepartmentSelect } from "./DepartmentSelect";
import { AccessSection, type AccessMap } from "./access/AccessSection";
import { useToast } from "@/hooks/use-toast";

/* ---------- Types ---------- */
export type AddUserPayload = {
  fullName: string;
  email: string;
  department: string; // department ID
  access: AccessMap;  // module + feature permissions (UI-only)
  message?: string;
  roles?: string[];   // legacy (unused)
};

/* ---------- Validation ---------- */
/**
 * AccessSection writes objects like:
 *   {
 *     _module: boolean,
 *     _role?: string,
 *     create?: boolean, read?: boolean, update?: boolean, delete?: boolean,
 *     ...other feature flags as booleans or string[]
 *   }
 */
const AccessModuleShape = z
  .object({
    _module: z.boolean().optional(),
    _role: z.string().optional(),
    create: z.boolean().optional(),
    read: z.boolean().optional(),
    update: z.boolean().optional(),
    delete: z.boolean().optional(),
  })
  // allow arbitrary feature flags (boolean or string[])
  .catchall(z.union([z.boolean(), z.array(z.string())]));

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email required"),
    department: z.string().min(1, "Select a department"),
    message: z.string().optional(),
    access: z.record(z.string(), AccessModuleShape).default({}),
  })
  .superRefine((val, ctx) => {
    const access = val.access || {};
    const entries = Object.entries(access);
    // must enable at least one module
    const enabled = entries.filter(([, m]) => (m as any)?._module);
    if (enabled.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enable at least one module.",
        path: ["access"],
      });
      return;
    }
    // every enabled module must have a role
    const missing = enabled.find(([key, m]) => !(m as any)?._role);
    if (missing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Select a role for "${missing[0]}".`,
        path: ["access", missing[0], "_role"],
      });
    }
  });

type AddUserFormValues = z.infer<typeof schema>;

/* ---------- Main form ---------- */
interface AddUserFormProps {
  onSubmit: (payload: AddUserPayload) => void;
  onCancel: () => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      access: {},
      message: "",
    },
    mode: "onSubmit",
  });

  const onValid = (values: AddUserFormValues) => {
    const payload: AddUserPayload = {
      fullName: values.fullName,
      email: values.email,
      department: values.department,
      access: values.access,
      message: values.message,
    };
    onSubmit(payload); // parent flips to Preview
  };

  const onInvalid = () => {
    // Prioritize human-friendly access errors
    const accessMsg =
      (errors as any)?.access?.message ||
      "Please enable at least one module and choose a role for each enabled module.";
    const first =
      errors.fullName?.message ||
      errors.email?.message ||
      errors.department?.message ||
      accessMsg;

    toast({
      title: "Can’t continue",
      description: first,
      variant: "destructive",
    });
  };

  const hasAccessError = Boolean((errors as any)?.access);

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-120px)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
          <p className="text-sm text-gray-500">
            Enter identity details, set department, and assign per‑module access.
          </p>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">User Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Full Name</Label>
            <Input
              {...register("fullName")}
              placeholder="John Doe"
              className="mt-1 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="john@example.org"
              className="mt-1 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Department */}
          <DepartmentSelect
            value={watch("department")}
            onChange={(value) => setValue("department", value, { shouldDirty: true })}
            error={errors.department?.message}
          />
        </div>
      </div>

      {/* Access matrix */}
      <div className={hasAccessError ? "rounded-md ring-2 ring-red-300" : ""}>
        <Controller
          name="access"
          control={control}
          render={({ field: { value, onChange } }) => (
            <AccessSection value={(value ?? {}) as AccessMap} onChange={onChange} />
          )}
        />
        {hasAccessError && (
          <p className="text-sm text-red-500 mt-2 ml-1">
            {((errors as any)?.access?.message as string) ??
              "Please enable at least one module and choose a role for each enabled module."}
          </p>
        )}
      </div>

      {/* Optional message */}
      <div>
        <Label className="text-sm text-gray-600">Optional message</Label>
        <Textarea
          {...register("message")}
          placeholder="Add a short message to include in the invitation…"
          className="resize-none focus-visible:ring-violet-600 focus-visible:ring-offset-2"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-violet-300 text-violet-700 hover:bg-violet-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Review Invite
        </Button>
      </div>
    </form>
  );
};
