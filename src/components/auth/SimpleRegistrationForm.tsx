import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Loader2 } from "lucide-react";

interface RegistrationData {
  organizationName: string;
  organizationType: "NGO" | "Donor" | "";
  email: string;
  password: string;
  contactPersonName: string;
  contactPhone: string;
  selectedModules: string[];
}

interface SimpleRegistrationFormProps {
  onShowLogin: () => void;
}

const SimpleRegistrationForm = ({ onShowLogin }: SimpleRegistrationFormProps) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationData>({
    organizationName: "",
    organizationType: "",
    email: "",
    password: "",
    contactPersonName: "",
    contactPhone: "",
    selectedModules: ["Fundraising", "Documents Manager"] // Default modules
  });

  const updateField = (field: keyof RegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { organizationName, organizationType, email, password, contactPersonName, contactPhone } = formData;
    
    if (!organizationName.trim()) {
      toast({
        title: "Organization Name Required",
        description: "Please enter your organization name.",
        variant: "destructive",
      });
      return false;
    }

    if (!organizationType) {
      toast({
        title: "Organization Type Required",
        description: "Please select your organization type.",
        variant: "destructive",
      });
      return false;
    }

    if (!contactPersonName.trim()) {
      toast({
        title: "Contact Person Name Required",
        description: "Please enter the contact person name.",
        variant: "destructive",
      });
      return false;
    }

    if (!contactPhone.trim()) {
      toast({
        title: "Contact Phone Required",
        description: "Please enter the contact phone number.",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!password.trim() || password.length < 8) {
      toast({
        title: "Valid Password Required",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, formData);
      
      if (error) {
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

  return (
    <div className="w-full lg:w-1/2 flex items-center lg:justify-start justify-center px-2 sm:px-12">
      <div className="w-full max-w-sm p-6 rounded-lg shadow-sm">
        {/* Welcome message */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Join Orbit</h1>
            <span className="h-5 w-5 text-blue-500">🚀</span>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            Create your organization account to get started
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-sm font-medium">
                Organization Name *
              </Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="e.g., Save the Children"
                value={formData.organizationName}
                onChange={(e) => updateField('organizationName', e.target.value)}
                className="h-10"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationType" className="text-sm font-medium">
                Organization Type *
              </Label>
              <Select
                value={formData.organizationType}
                onValueChange={(value: "NGO" | "Donor") => updateField('organizationType', value)}
                disabled={isLoading}
                required
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGO">Non-Governmental Organization (NGO)</SelectItem>
                  <SelectItem value="Donor">Donor Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPersonName" className="text-sm font-medium">
                Contact Person Name *
              </Label>
              <Input
                id="contactPersonName"
                type="text"
                placeholder="John Doe"
                value={formData.contactPersonName}
                onChange={(e) => updateField('contactPersonName', e.target.value)}
                className="h-10"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-sm font-medium">
                Contact Phone *
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                className="h-10"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@organization.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="h-10"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className="h-10"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md text-sm transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>

        {/* Sign In Link */}
        <p className="mt-4 text-center text-gray-500 text-xs">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onShowLogin}
            className="text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
          >
            Sign in
          </button>
        </p>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <div className="mb-3">© 2025 Orbit ERP. All rights reserved.</div>
          <div className="flex justify-center space-x-3">
            <a href="#" className="hover:text-violet-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-violet-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-violet-600">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRegistrationForm;