
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <div className="space-y-1 md:col-span-2">
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

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="organizationType" className="text-xs">
            Organization Type *
          </Label>
          <Select
            value={formData.organizationType}
            onValueChange={(value: "NGO" | "Donor") =>
              updateFormData({ organizationType: value })
            }
          >
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGO">Non-Governmental Organization (NGO)</SelectItem>
              <SelectItem value="Donor">Donor Organization/Individual Donor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs">
            Primary Contact Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g., admin@yourorganization.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
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
              placeholder="Min 8 chars"
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

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs">
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
            className="h-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
