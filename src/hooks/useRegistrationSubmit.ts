
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
      const { error } = await signUp(formData.email, formData.password, formData);

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      } else {
        // Registration successful - user is automatically logged in
        navigate('/dashboard');
      }
      
      return { error };
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

  return { handleSubmit, isLoading };
};
