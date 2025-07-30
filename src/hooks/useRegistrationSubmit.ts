
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "@/hooks/use-toast";
import { RegistrationData } from "@/components/auth/RegistrationForm";

export const useRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (formData: RegistrationData) => {
    setIsLoading(true);

    try {
      const { error } = await signUp(formData.contactEmail, formData.password, formData);

      if (!error) {
        toast({
          title: "Registration Successful",
          description: `Welcome to Orbit ERP, ${formData.organizationName}! Please check your email to confirm your account.`,
        });
        
        // Don't navigate immediately - user needs to confirm email first
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
