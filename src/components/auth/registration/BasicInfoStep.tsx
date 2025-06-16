
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { RegistrationData } from "../RegistrationForm";

interface BasicInfoStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  // Function to generate acronym from organization name
  const generateAcronym = (name: string): string => {
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 6); // Limit to 6 characters
  };

  // Handle organization name change and auto-generate acronym
  const handleOrganizationNameChange = (value: string) => {
    updateFormData({ organizationName: value });
    
    // Auto-generate acronym only if current acronym is empty or was auto-generated
    const newAcronym = generateAcronym(value);
    if (!formData.acronym || formData.acronym === generateAcronym(formData.organizationName)) {
      updateFormData({ acronym: newAcronym });
    }
  };

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
            onChange={(e) => handleOrganizationNameChange(e.target.value)}
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
          <Label htmlFor="organizationType" className="text-xs">
            Organization Type *
          </Label>
          <Select
            value={formData.organizationType}
            onValueChange={(value: 'NGO' | 'Donor') => updateFormData({ organizationType: value })}
          >
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="NGO">NGO</SelectItem>
              <SelectItem value="Donor">Donor</SelectItem>
            </SelectContent>
          </Select>
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
