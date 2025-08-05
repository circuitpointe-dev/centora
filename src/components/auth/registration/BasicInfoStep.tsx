
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
import { Button } from "@/components/ui/button";
import { RegistrationData, CURRENCY_OPTIONS } from "@/types/registration";

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
          Organization Details
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Tell us about your organization and primary contact
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="organizationName" className="text-sm font-medium">
            Organization Name *
          </Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={(e) => updateFormData({ organizationName: e.target.value })}
            placeholder="Enter organization name"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationType" className="text-sm font-medium">
            Organization Type *
          </Label>
          <Select
            value={formData.organizationType}
            onValueChange={(value) => updateFormData({ organizationType: value as 'NGO' | 'Donor' })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGO">NGO</SelectItem>
              <SelectItem value="Donor">Donor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="organizationAddress" className="text-sm font-medium">
            Organization Address *
          </Label>
          <Input
            id="organizationAddress"
            value={formData.organizationAddress}
            onChange={(e) => updateFormData({ organizationAddress: e.target.value })}
            placeholder="Enter organization address"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryCurrency" className="text-sm font-medium">
            Primary Currency *
          </Label>
          <Select
            value={formData.primaryCurrency}
            onValueChange={(value) => updateFormData({ primaryCurrency: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPersonName" className="text-sm font-medium">
            Contact Person Name *
          </Label>
          <Input
            id="contactPersonName"
            value={formData.contactPersonName}
            onChange={(e) => updateFormData({ contactPersonName: e.target.value })}
            placeholder="Enter contact person name"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone" className="text-sm font-medium">
            Contact Phone *
          </Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => updateFormData({ contactPhone: e.target.value })}
            placeholder="Enter phone number"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Enter email address"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              placeholder="Enter password"
              className="h-10 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
