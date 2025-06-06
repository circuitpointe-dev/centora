import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { RegistrationData } from "../RegistrationForm";

interface BasicInfoStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Tell us about your organization
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Just the essentials to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="organizationName" className="text-xs">
            Official Organization Name *
          </Label>
          <Input
            id="organizationName"
            type="text"
            placeholder="e.g., Hope for All Foundation"
            value={formData.organizationName}
            onChange={(e) =>
              updateFormData({ organizationName: e.target.value })
            }
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="acronym" className="text-xs">
            Acronym/Short Name
          </Label>
          <Input
            id="acronym"
            type="text"
            placeholder="e.g., HFAF"
            value={formData.acronym}
            onChange={(e) => updateFormData({ acronym: e.target.value })}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactPersonName" className="text-xs">
            Primary Contact Person Name *
          </Label>
          <Input
            id="contactPersonName"
            type="text"
            placeholder="e.g., Amina Yusuf"
            value={formData.contactPersonName}
            onChange={(e) =>
              updateFormData({ contactPersonName: e.target.value })
            }
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactEmail" className="text-xs">
            Primary Contact Email *
          </Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="e.g., amina.yusuf@org.com"
            value={formData.contactEmail}
            onChange={(e) => updateFormData({ contactEmail: e.target.value })}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="contactPhone" className="text-xs">
            Primary Contact Phone Number *
          </Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="e.g., +234 801 234 5678"
            value={formData.contactPhone}
            onChange={(e) => updateFormData({ contactPhone: e.target.value })}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs">
            Password *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, mixed case, number, symbol"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              className="h-10 text-sm"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-2 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-3 w-3 text-gray-400" />
              ) : (
                <Eye className="h-3 w-3 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
