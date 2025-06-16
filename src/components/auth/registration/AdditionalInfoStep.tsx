
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RegistrationData } from "../RegistrationForm";

interface AdditionalInfoStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const AdditionalInfoStep = ({
  formData,
  updateFormData,
}: AdditionalInfoStepProps) => {
  const focusAreaOptions = [
    "Education",
    "Health",
    "Environment",
    "Poverty Alleviation",
    "Human Rights",
    "Community Development",
    "Women Empowerment",
    "Child Welfare",
    "Elderly Care",
    "Disaster Relief",
  ];

  const currencies = ["NGN (₦)", "USD ($)", "EUR (€)", "GBP (£)", "Others"];

  const handleFocusAreaToggle = (area: string) => {
    const updatedAreas = formData.focusAreas.includes(area)
      ? formData.focusAreas.filter((a) => a !== area)
      : [...formData.focusAreas, area];

    updateFormData({ focusAreas: updatedAreas });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tell us more</h2>
        <p className="text-sm text-gray-600 mt-1">
          Help us tailor your experience. You can fill this later in your
          settings.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="address" className="text-sm">
            Full Registered Address
          </Label>
          <Textarea
            id="address"
            placeholder="Street, City, State, Postal Code, Country"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="text-sm min-h-[60px]"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="establishmentDate" className="text-sm">
              Date of Establishment
            </Label>
            <Input
              id="establishmentDate"
              type="date"
              value={formData.establishmentDate}
              onChange={(e) =>
                updateFormData({ establishmentDate: e.target.value })
              }
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="currency" className="text-sm">
              Primary Currency
            </Label>
            <Select
              value={formData.currency || ""}
              onValueChange={(value) => updateFormData({ currency: value })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency}
                    value={currency}
                    className="text-sm"
                  >
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-sm">Focus Areas</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {focusAreaOptions.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={formData.focusAreas.includes(area)}
                  onCheckedChange={() => handleFocusAreaToggle(area)}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={area}
                  className="text-sm font-normal leading-none cursor-pointer"
                >
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
