import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SignupPage = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<"NGO" | "Donor" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUpWithOAuth } = useAuth();

  const handleOAuthSignup = async (provider: 'google' | 'azure') => {
    if (!organizationName.trim()) {
      toast({
        title: "Organization Name Required",
        description: "Please enter your organization name before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (!organizationType) {
      toast({
        title: "Organization Type Required",
        description: "Please select your organization type before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithOAuth(organizationName.trim(), organizationType, provider);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to start registration process.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Orbit ERP
          </h1>
          <p className="text-gray-600">
            Create your organization account to get started
          </p>
        </div>

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
                className="h-12"
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
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGO">Non-Governmental Organization (NGO)</SelectItem>
                  <SelectItem value="Donor">Donor Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Continue with</span>
              </div>
            </div>

            <Button
              onClick={() => handleOAuthSignup('google')}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 text-sm font-medium"
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
              className="w-full h-12 text-sm font-medium"
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

          {/* Existing Users Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
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
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
