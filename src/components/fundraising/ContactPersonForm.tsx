import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface ContactPerson {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface ContactPersonFormProps {
  contact: ContactPerson;
  onUpdate: (contact: ContactPerson) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export const ContactPersonForm: React.FC<ContactPersonFormProps> = ({
  contact,
  onUpdate,
  onDelete,
  canDelete,
}) => {
  const handleChange = (field: keyof ContactPerson, value: string) => {
    onUpdate({ ...contact, [field]: value });
  };

  const isEmpty =
    !contact.fullName.trim() &&
    !contact.email.trim() &&
    !contact.phone.trim();

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900">Contact Person</h4>

        {/* Only render delete when parent allows and the row has content */}
        {canDelete && !isEmpty && (
          <Button
            type="button" // <-- important: don't submit the form
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="text-sm text-gray-600">Full Name *</Label>
          <Input
            value={contact.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter full name"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Email *</Label>
            <Input
              type="email"
              value={contact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-600">Phone Number *</Label>
            <Input
              type="tel"
              value={contact.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
