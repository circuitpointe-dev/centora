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
import { RoleMultiSelect } from "./RoleMultiSelect";
import { AccessSection, type AccessMap } from "./AccessSection";

/* ---------- Types ---------- */
export type AddUserPayload = {
  fullName: string;
  email: string;
  department: string; // department ID
  roles: string[];    // role IDs
  access: AccessMap;  // module + feature permissions
  message?: string;
};

/* ---------- Validation ---------- */
/** Minimal but safe schema for AccessMap */
const AccessFeatureValue = z.union([z.boolean(), z.array(z.string())]);
const AccessModuleShape = z
  .record(z.string(), AccessFeatureValue)
  .and(z.object({ _module: z.boolean().optional() }));

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  department: z.string().min(1, "Select a department"),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  message: z.string().optional(),
  access: z.record(z.string(), AccessModuleShape).default({}),
});

/* ---------- Main form ---------- */
interface AddUserFormProps {
  onSubmit: (payload: AddUserPayload) => void;
  onCancel: () => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<AddUserPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      roles: [],
      access: {},
      message: "",
    },
  });

  const onValid = (payload: AddUserPayload) => onSubmit(payload);

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-120px)]"
    >
      {/* User Details */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">User Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Full Name</Label>
            <Input {...register("fullName")} placeholder="John Doe" className="mt-1" />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <Input type="email" {...register("email")} placeholder="john@example.org" className="mt-1" />
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

          {/* Roles */}
          <RoleMultiSelect
            value={watch("roles")}
            onChange={(value) => setValue("roles", value, { shouldDirty: true })}
            error={errors.roles?.message}
          />
        </div>
      </div>

      {/* ACCESS - keep it controlled via RHF */}
      <Controller
        name="access"
        control={control}
        render={({ field: { value, onChange } }) => (
          <AccessSection value={(value ?? {}) as AccessMap} onChange={onChange} />
        )}
      />

      {/* Optional message */}
      <div>
        <Label className="text-sm text-gray-600">Optional message</Label>
        <Textarea
          {...register("message")}
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
          Review Invite
        </Button>
      </div>
    </form>
  );
};