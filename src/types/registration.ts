export interface RegistrationData {
  // Basic Info + Contact (Step 1)
  organizationName: string;
  organizationType: 'NGO' | 'Donor';
  organizationAddress: string;
  primaryCurrency: string;
  contactPersonName: string;
  contactPhone: string;
  email: string;
  password: string;
  
  // Module Selection (Step 2)
  selectedModules: string[];
  
  // Pricing Selection (Step 3)
  selectedPricingTier: string;
  
  // Confirmation (Step 4)
  termsAccepted: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  features: string[] | any; // Allow any to handle Json type from Supabase
  is_active: boolean;
  created_at?: string;
}

export const AVAILABLE_MODULES = [
  { name: "Fundraising", available: true },
  { name: "Documents Manager", available: true },
  { name: "Programme Management", available: false },
  { name: "Procurement", available: false },
  { name: "Inventory Management", available: false },
  { name: "Finance & Control", available: false },
  { name: "Learning Management", available: false },
  { name: "HR Management", available: false },
  { name: "User Management", available: false },
  { name: "Grant Management", available: false },
];

export const CURRENCY_OPTIONS = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'KES', 'UGX', 'TZS', 'RWF'
];