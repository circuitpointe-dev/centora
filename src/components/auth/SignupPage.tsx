import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-[320px] mx-auto">
      {children}
    </div>
  );
};

const SignupPage = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<"NGO" | "Donor" | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUpWithOAuth, signUp } = useAuth();

  const validateBasicInfo = () => {
    if (!organizationName.trim()) {
      toast({
        title: "Organization Name Required",
        description: "Please enter your organization name before continuing.",
        variant: "destructive",
      });
      return false;
    }

    if (!organizationType) {
      toast({
        title: "Organization Type Required",
        description: "Please select your organization type before continuing.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleOAuthSignup = async (provider: 'google' | 'azure') => {
    if (!validateBasicInfo()) return;

    setIsLoading(true);
    try {
      await signUpWithOAuth(organizationName.trim(), organizationType as "NGO" | "Donor", provider);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to start registration process.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    if (!validateBasicInfo()) return;

    if (!email.trim() || !password.trim() || !contactPersonName.trim() || !contactPhone.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = {
        organizationName: organizationName.trim(),
        organizationType,
        email: email.trim(),
        password,
        contactPersonName: contactPersonName.trim(),
        contactPhone: contactPhone.trim(),
        selectedModules: ["Fundraising", "Documents Manager"], // Default modules
      };

      const { error } = await signUp(email, password, formData);
      
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
        {/* Wrapped Form Content */}
        <FormContainer>
        {/* Organization Info Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-sm font-medium">
                Organization Name *
              </Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="e.g., Save the Children"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="h-10"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationType" className="text-sm font-medium">
                Organization Type *
              </Label>
              <Select
                value={organizationType}
                onValueChange={(value: "NGO" | "Donor") => setOrganizationType(value)}
                disabled={isLoading}
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
          </div>

          {!showEmailForm ? (
            <>
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Continue with</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleOAuthSignup('google')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full h-10 text-sm font-medium"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  onClick={() => handleOAuthSignup('azure')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full h-10 text-sm font-medium"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.1 2L4.7 3.7l1.2 11.2 6.2 6.2 6.2-6.2L19.5 3.7 12.1 2zm4.8 7.9h-8v-1.6h8v1.6zm0-2.4h-8V5.9h8v1.6z"
                    />
                  </svg>
                  Continue with Microsoft
                </Button>
              </div>

              {/* Email Option */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowEmailForm(true)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Or sign up with email
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Email Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName" className="text-sm font-medium">
                    Contact Person Name *
                  </Label>
                  <Input
                    id="contactPersonName"
                    type="text"
                    placeholder="John Doe"
                    value={contactPersonName}
                    onChange={(e) => setContactPersonName(e.target.value)}
                    className="h-10"
                    disabled={isLoading}
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
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-10"
                    disabled={isLoading}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10"
                    disabled={isLoading}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleEmailSignup}
                  disabled={isLoading}
                  className="w-full h-10 bg-violet-600 text-white hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  Create Account
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  Back to OAuth options
                </Button>
              </div>
            </>
          )}

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
        </div>

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
