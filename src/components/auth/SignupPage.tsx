import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-[320px] mx-auto">
      {children}
    </div>
  );
};

const SignupPage = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "" as "NGO" | "Donor" | "",
    email: "",
    password: "",
    contactPersonName: "",
    contactPhone: "",
    selectedModules: ["Fundraising", "Documents Manager"]
  });

  const updateField = (field: string, value: any) => {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-purple mb-2">
            Join Orbit ERP
          </h1>
          <p className="text-muted-foreground">
            Create your organization account to get started
          </p>
        </div>
        
        {/* Registration Form */}
        <FormContainer>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-violet-600 text-white hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
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

            {/* Existing Users Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default SignupPage;
