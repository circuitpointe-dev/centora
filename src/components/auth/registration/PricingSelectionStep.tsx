import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationData, PricingTier } from "@/types/registration";

interface PricingSelectionStepProps {
  formData: RegistrationData;
  updateFormData: (data: Partial<RegistrationData>) => void;
}

const PricingSelectionStep = ({ formData, updateFormData }: PricingSelectionStepProps) => {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingTiers = async () => {
      try {
        const { data, error } = await supabase
          .from('pricing_tiers')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.error('Error fetching pricing tiers:', error);
          return;
        }

        const mappedTiers = (data || []).map(tier => ({
          ...tier,
          features: Array.isArray(tier.features) ? tier.features : []
        }));
        setPricingTiers(mappedTiers);
      } catch (error) {
        console.error('Error fetching pricing tiers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingTiers();
  }, []);

  const handleTierSelect = (tierName: string) => {
    updateFormData({ selectedPricingTier: tierName });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading pricing options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Choose Your Plan
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Select the plan that best fits your organization's needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              formData.selectedPricingTier === tier.name
                ? 'ring-2 ring-violet-500 border-violet-500'
                : 'border-gray-200 hover:border-violet-300'
            }`}
            onClick={() => handleTierSelect(tier.name)}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tier.display_name}</CardTitle>
                {formData.selectedPricingTier === tier.name && (
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <CardDescription className="text-sm">
                {tier.description}
              </CardDescription>
              {tier.name === 'growing_teams' && (
                <Badge variant="secondary" className="mt-2 w-fit mx-auto">
                  Most Popular
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(tier.features as string[]).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.selectedPricingTier && (
        <div className="mt-4 p-3 bg-violet-50 rounded-lg">
          <p className="text-sm text-violet-700">
            Selected: {pricingTiers.find(t => t.name === formData.selectedPricingTier)?.display_name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingSelectionStep;