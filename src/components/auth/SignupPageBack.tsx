import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import LoginLeftColumn from "@/components/auth/LoginLeftColumn";

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    contactPhone: "",
    country: "",
    selectedModules: [] as string[],
  });

  const allModules = [
    // Left column (in visual order)
    { name: "Fundraising", available: true },
    { name: "Inventory Management", available: true },
    { name: "Learning Management", available: true },
    { name: "Human Resource Management", available: true },
    { name: "User Management", available: true },
    // Right column
    { name: "Program Management", available: true },
    { name: "Procurement", available: true },
    { name: "Finance & Control", available: true },
    { name: "Document Management", available: true },
    { name: "Grants Management", available: true },
  ];

  const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "United Kingdom", "United States"];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleToggle = (moduleName: string) => {
    const module = allModules.find(m => m.name === moduleName);
    if (!module || !module.available) return;
    const isSelected = formData.selectedModules.includes(moduleName);
    const updatedModules = isSelected
      ? formData.selectedModules.filter(m => m !== moduleName)
      : [...formData.selectedModules, moduleName];
    updateField('selectedModules', updatedModules);
  };

  const validateForm = () => {
    const { organizationName, email, password, contactPhone, country, selectedModules } = formData;
    if (!organizationName.trim()) {
      toast({
        title: "Organization Name Required",
        description: "Please enter your organization name.",
        variant: "destructive",
      });
      return false;
    }
    if (!country.trim()) {
      toast({
        title: "Country Required",
        description: "Please select your country.",
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
    if (selectedModules.length === 0) {
      toast({
        title: "Module Selection Required",
        description: "Please select at least one ERP module.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowReview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await register(formData.email, formData.password, formData.organizationName || formData.email);
      if (success) {
        toast({
          title: "Account Created Successfully!",
          description: "Please sign in with your credentials.",
          variant: "default",
        });
        navigate('/login');
      } else {
        toast({
          title: "Registration Failed",
          description: "Please try again.",
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
    <div className="h-screen bg-background flex items-center justify-center p-1 sm:p-2">
      <div className="w-full max-w-6xl bg-card rounded-lg border shadow-sm flex flex-col lg:flex-row overflow-hidden h-full max-h-[98vh]">
        {/* Left illustration (reused from login) */}
        <div className="hidden lg:flex lg:w-1/2">
          <LoginLeftColumn />
        </div>

        {/* Right: Signup form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-2 sm:px-4 py-2 overflow-y-auto">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hello there</h1>
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 animate-pulse">👋</span>
              </div>
              <p className="text-violet-600 font-medium mt-1 text-xs sm:text-sm">Register your NGO</p>
            </div>

            <form onSubmit={showReview ? handleSubmit : handleNext} className="space-y-2">
              {!showReview ? (
                <>
                  {/* Organization Details */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div>
                        <Label htmlFor="organizationName" className="text-xs font-medium">Organization Name</Label>
                        <Input
                          id="organizationName"
                          type="text"
                          placeholder=""
                          value={formData.organizationName}
                          onChange={(e) => updateField('organizationName', e.target.value)}
                          className="h-7 sm:h-8 mt-0.5 text-xs"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-xs font-medium">Organization Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder=""
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="h-7 sm:h-8 mt-0.5 text-xs"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div>
                        <Label htmlFor="contactPhone" className="text-xs font-medium">Telephone</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder=""
                          value={formData.contactPhone}
                          onChange={(e) => updateField('contactPhone', e.target.value)}
                          className="h-7 sm:h-8 mt-0.5 text-xs"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-xs font-medium">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => updateField('country', value)}
                          disabled={isLoading}
                          required
                        >
                          <SelectTrigger className="h-7 sm:h-8 mt-0.5 text-xs">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                      <div className="relative mt-0.5">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder=""
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          className="h-7 sm:h-8 pr-7 text-xs"
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-1.5 py-0.5 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Module Selection */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-foreground">Select Modules</h3>
                      <span className="text-xs text-muted-foreground">
                        {formData.selectedModules.length} selected
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {allModules.map((module) => (
                        <div
                          key={module.name}
                          className={`flex items-start space-x-1.5 p-1.5 rounded border transition-all duration-200 ${!module.available
                            ? 'opacity-50 bg-muted/50 cursor-not-allowed'
                            : 'bg-background hover:border-primary/50 hover:shadow-sm cursor-pointer'
                            }`}
                        >
                          <Checkbox
                            id={module.name}
                            checked={formData.selectedModules.includes(module.name)}
                            onCheckedChange={() => handleModuleToggle(module.name)}
                            className="h-3 w-3 mt-0.5 flex-shrink-0"
                            disabled={!module.available || isLoading}
                          />
                          <Label
                            htmlFor={module.name}
                            className={`text-xs font-normal leading-tight cursor-pointer ${!module.available
                              ? 'text-muted-foreground cursor-not-allowed'
                              : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              }`}
                          >
                            {module.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Review Section */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Review Your Information</h3>
                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Organization:</span> {formData.organizationName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {formData.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {formData.contactPhone}
                        </div>
                        <div>
                          <span className="font-medium">Country:</span> {formData.country}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-xs">Selected Modules:</span>
                        <div className="text-xs mt-1">
                          {formData.selectedModules.length > 0 ? formData.selectedModules.join(', ') : 'None selected'}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReview(false)}
                      className="h-7 text-xs"
                    >
                      Edit Information
                    </Button>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-8 sm:h-9 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Creating Account...
                    </>
                  ) : showReview ? (
                    "Sign Up"
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>

              {/* Links */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-violet-600 hover:text-violet-700 underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </p>
                <div className="mt-2">
                  <Link to="/">
                    <Button variant="ghost" className="text-gray-700 hover:text-violet-600 h-6 text-xs">
                      ← Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;