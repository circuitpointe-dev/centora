import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationData, PricingTier } from "@/types/registration";

interface ConfirmationStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const ConfirmationStep = ({ formData, updateFormData }: ConfirmationStepProps) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  useEffect(() => {
    const fetchSelectedTier = async () => {
      if (!formData.selectedPricingTier) return;

      try {
        const { data, error } = await supabase
          .from('pricing_tiers')
          .select('*')
          .eq('name', formData.selectedPricingTier)
          .single();

        if (!error && data) {
          const mappedTier = {
            ...data,
            features: Array.isArray(data.features) ? data.features : []
          };
          setSelectedTier(mappedTier);
        }
      } catch (error) {
        console.error('Error fetching selected tier:', error);
      }
    };

    fetchSelectedTier();
  }, [formData.selectedPricingTier]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Confirm Registration
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Please review your information before completing registration
        </p>
      </div>

      {/* Organization Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Organization:</span>
              <p className="text-gray-900">{formData.organizationName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <p className="text-gray-900">{formData.organizationType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Address:</span>
              <p className="text-gray-900">{formData.organizationAddress}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Currency:</span>
              <p className="text-gray-900">{formData.primaryCurrency}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Contact Person:</span>
              <p className="text-gray-900">{formData.contactPersonName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>
              <p className="text-gray-900">{formData.contactPhone}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Admin Email:</span>
              <p className="text-gray-900">{formData.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Selected Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.selectedModules.map((module) => (
              <Badge key={module} variant="secondary" className="text-sm">
                {module}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Pricing Tier */}
      {selectedTier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  {selectedTier.display_name}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{selectedTier.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => 
                updateFormData({ termsAccepted: checked as boolean })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="termsAccepted" className="text-sm cursor-pointer">
                I agree to the{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 hover:text-violet-800 underline inline-flex items-center"
                >
                  Terms & Conditions
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                {" "}and acknowledge that I am authorized to register this organization.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center">
        By completing registration, an admin account will be created for you to access the system.
        You will be redirected to the sign-in page to log in with your credentials.
      </div>
    </div>
  );
};

export default ConfirmationStep;