import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CalendarIcon, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [establishmentDate, setEstablishmentDate] = useState<Date>();
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "" as "NGO" | "Donor" | "",
    email: "",
    password: "",
    contactPersonName: "",
    contactPhone: "",
    selectedModules: [] as string[],
    address: "",
    establishmentDate: "",
    currency: "USD"
  });

  const allModules = [
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

  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "NGN", label: "Nigerian Naira (NGN)" },
    { value: "KES", label: "Kenyan Shilling (KES)" },
    { value: "GHS", label: "Ghanaian Cedi (GHS)" },
    { value: "ZAR", label: "South African Rand (ZAR)" },
  ];

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

  const handleDateSelect = (date: Date | undefined) => {
    setEstablishmentDate(date);
    updateField('establishmentDate', date ? format(date, 'yyyy-MM-dd') : '');
  };

  const validateForm = () => {
    const { organizationName, organizationType, email, password, contactPersonName, contactPhone, selectedModules } = formData;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const success = await register(formData.email, formData.password, formData.contactPersonName);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
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
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName" className="text-sm font-medium">
                    Organization Name *
                  </Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="e.g., Save the Children"
                    value={formData.organizationName}
                    onChange={(e) => updateField('organizationName', e.target.value)}
                    className="h-10 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organizationType" className="text-sm font-medium">
                    Organization Type *
                  </Label>
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value: "NGO" | "Donor") => updateField('organizationType', value)}
                    disabled={isLoading}
                    required
                  >
                    <SelectTrigger className="h-10 mt-1">
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGO">Non-Governmental Organization (NGO)</SelectItem>
                      <SelectItem value="Donor">Donor Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPersonName" className="text-sm font-medium">
                    Contact Person Name *
                  </Label>
                  <Input
                    id="contactPersonName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.contactPersonName}
                    onChange={(e) => updateField('contactPersonName', e.target.value)}
                    className="h-10 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium">
                    Contact Phone *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="h-10 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@organization.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="h-10 mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="h-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">ERP Modules *</h3>
                <span className="text-sm text-muted-foreground">
                  {formData.selectedModules.length} selected
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Select the modules your organization needs. Only highlighted modules are currently available.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allModules.map((module) => (
                  <div 
                    key={module.name} 
                    className={`flex items-start space-x-2 p-3 rounded-md border transition-all duration-200 ${
                      !module.available 
                        ? 'opacity-50 bg-muted/50 cursor-not-allowed' 
                        : 'bg-background hover:border-primary/50 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    <Checkbox
                      id={module.name}
                      checked={formData.selectedModules.includes(module.name)}
                      onCheckedChange={() => handleModuleToggle(module.name)}
                      className="h-4 w-4 mt-0.5 flex-shrink-0"
                      disabled={!module.available || isLoading}
                    />
                    <Label
                      htmlFor={module.name}
                      className={`text-sm font-normal leading-tight cursor-pointer ${
                        !module.available 
                          ? 'text-muted-foreground cursor-not-allowed' 
                          : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      }`}
                    >
                      {module.name}
                      {!module.available && (
                        <span className="text-xs text-muted-foreground block">Coming Soon</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Organization address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="min-h-[80px] mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Establishment Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-10 justify-start text-left font-normal mt-1",
                            !establishmentDate && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {establishmentDate ? format(establishmentDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={establishmentDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Primary Currency
                    </Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => updateField('currency', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-10 mt-1">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-violet-600 text-white hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

            {/* Links */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <div className="text-center sm:text-left">
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
              <div className="text-center sm:text-right">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Home
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;