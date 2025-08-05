import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RegistrationData } from "@/types/registration";

export const useNewRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveProgress = async (email: string, step: number, formData: RegistrationData) => {
    try {
      const { error } = await supabase.rpc('save_registration_progress', {
        p_email: email,
        p_step: step,
        p_form_data: formData as any
      });

      if (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Warning",
          description: "Could not save registration progress",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSubmit = async (formData: RegistrationData) => {
    setIsLoading(true);

    try {
      // Call the RPC function to register organization and user
      const { data, error } = await supabase.rpc('register_organization_and_user', {
        p_organization_name: formData.organizationName,
        p_organization_type: formData.organizationType as 'NGO' | 'Donor',
        p_organization_address: formData.organizationAddress,
        p_primary_currency: formData.primaryCurrency,
        p_contact_phone: formData.contactPhone,
        p_full_name: formData.contactPersonName,
        p_email: formData.email,
        p_password: formData.password,
        p_selected_modules: formData.selectedModules,
        p_pricing_tier_name: formData.selectedPricingTier
      });

      if (data && typeof data === 'object' && 'error' in data) {
        toast({
          title: "Registration Failed",
          description: data.error as string,
          variant: "destructive",
        });
        return { error: new Error(data.error as string) };
      }

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
        return { error };
      }

      if (data && typeof data === 'object' && 'success' in data) {
        toast({
          title: "Registration Successful!",
          description: "Your organization has been registered. Please sign in with your credentials.",
        });
        return { success: true };
      }

      return { error: new Error("Unexpected response") };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, saveProgress, isLoading };
};