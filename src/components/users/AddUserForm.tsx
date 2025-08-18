import React from "react";
import { useForm } from "react-hook-form";
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

  const access = watch("access") as AccessMap;

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
          <DepartmentSelect
            value={watch("department")}
            onChange={(value) => setValue("department", value)}
            error={errors.department?.message}
          />

          {/* Roles */}
          <RoleMultiSelect
            value={watch("roles")}
            onChange={(value) => setValue("roles", value)}
            error={errors.roles?.message}
          />
        </div>
      </div>

      {/* ACCESS */}
      <AccessSection
        value={access}
        onChange={(value) => setValue("access", value)}
      />

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
