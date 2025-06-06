
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RegistrationData } from "@/components/auth/RegistrationForm";

export const useRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (formData: RegistrationData) => {
    setIsLoading(true);

    try {
      const success = await register(formData.contactEmail, formData.password, formData.organizationName);

      if (success) {
        // Store selected modules for the user
        localStorage.setItem("userModules", JSON.stringify(formData.selectedModules.map(module => module.toLowerCase().replace(/\s+/g, ''))));
        localStorage.setItem("isAuthenticated", "true");

        toast({
          title: "Registration Successful",
          description: `Welcome to Orbit ERP, ${formData.organizationName}!`,
        });
        
        navigate("/dashboard/fundraising/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
