
import { RegistrationData } from "@/components/auth/RegistrationForm";

export const validateStep1 = (formData: RegistrationData) => {
  const { organizationName, organizationType, email, password, confirmPassword } = formData;
  
  const errors: string[] = [];

  if (!organizationName || !organizationType || !email || !password || !confirmPassword) {
    errors.push("Please fill in all required fields");
  }

  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Please enter a valid email address");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStep2 = (formData: RegistrationData) => {
  const errors: string[] = [];

  if (formData.selectedModules.length === 0) {
    errors.push("Please select at least one ERP module");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
