
import { RegistrationData } from "@/types/registration";

export const validateStep1 = (formData: RegistrationData) => {
  const { organizationName, organizationType, organizationAddress, primaryCurrency, email, password, contactPersonName, contactPhone } = formData;
  
  const errors: string[] = [];

  if (!organizationName || !organizationType || !organizationAddress || !primaryCurrency || !email || !password || !contactPersonName || !contactPhone) {
    errors.push("Please fill in all required fields");
  }

  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.push("Please enter a valid email address");
  }

  if (password && password.length < 8) {
    errors.push("Password must be at least 8 characters long");
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
