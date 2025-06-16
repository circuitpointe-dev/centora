
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RegistrationData } from "../RegistrationForm";

interface AdditionalInfoStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const AdditionalInfoStep = ({
  formData,
  updateFormData,
}: AdditionalInfoStepProps) => {
  const currencies = ["NGN (₦)", "USD ($)", "EUR (€)", "GBP (£)", "Others"];

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateFormData({ establishmentDate: format(date, "yyyy-MM-dd") });
    } else {
      updateFormData({ establishmentDate: "" });
    }
  };

  const selectedDate = formData.establishmentDate 
    ? new Date(formData.establishmentDate) 
    : undefined;

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
            <Label className="text-sm">
              Date of Establishment
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 text-sm justify-start text-left font-normal w-full",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
