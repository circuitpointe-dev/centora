import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Eye, EyeOff, Check, Plus, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LoginLeftColumn from "@/components/auth/LoginLeftColumn";

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "NGO",
    email: "",
    password: "",
    contactPhone: "",
    country: "",
    selectedModules: ["User Management"] as string[],
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
    // Always include User Management; cannot be deselected
    if (moduleName === 'User Management') return;
    const module = allModules.find(m => m.name === moduleName);
    if (!module || !module.available) return;
    const isSelected = formData.selectedModules.includes(moduleName);
    const updatedModules = isSelected
      ? formData.selectedModules.filter(m => m !== moduleName)
      : [...formData.selectedModules, moduleName];
    // Ensure User Management stays present
    if (!updatedModules.includes('User Management')) {
      updatedModules.push('User Management');
    }
    updateField('selectedModules', updatedModules);
  };

  const validateForm = () => {
    const { organizationName, organizationType, email, password, contactPhone, country, selectedModules } = formData;
    if (!organizationName.trim()) {
      if (!organizationType) {
        toast({ title: "Organization Type Required", description: "Please select NGO or Donor.", variant: "destructive" });
        return false;
      }
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
      if (!success) {
        toast({ title: "Registration Failed", description: "Please try again.", variant: "destructive" });
        return;
      }

      // Attempt to establish a session for the new user to perform org setup
      await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
      const { data: userData } = await supabase.auth.getUser();
      const newUserId = userData?.user?.id;

      // Persist Organization + Modules + Link profile
      if (newUserId) {
        // 1) Create organization
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: formData.organizationName || formData.email,
            type: (formData.organizationType === 'Donor' ? 'DONOR' : 'NGO'),
            country: formData.country || null,
            phone: formData.contactPhone || null,
          })
          .select('id')
          .single();

        if (orgError) throw orgError;

        // 2) Subscribe selected modules (ensure unique + mapped slugs)
        const nameToSlug: Record<string, string> = {
          'Fundraising': 'fundraising',
          'Inventory Management': 'inventory',
          'Learning Management': 'learning',
          'Human Resource Management': 'hr',
          'User Management': 'users',
          'Program Management': 'programme',
          'Procurement': 'procurement',
          'Finance & Control': 'finance',
          'Document Management': 'documents',
          'Grants Management': 'grants',
        };
        const uniqueModules = Array.from(new Set(formData.selectedModules));
        const rows = uniqueModules
          .map((name) => nameToSlug[name] as 'fundraising' | 'inventory' | 'learning' | 'hr' | 'users' | 'programme' | 'procurement' | 'finance' | 'documents' | 'grants')
          .filter(Boolean)
          .map((module) => ({ org_id: org.id, module }));

        if (rows.length > 0) {
          const { error: modError } = await supabase.from('organization_modules').insert(rows);
          if (modError) throw modError;
        }

        // 3) Link profile to org
        const { error: profErr } = await supabase
          .from('profiles')
          .update({ org_id: org.id })
          .eq('id', newUserId);
        if (profErr) throw profErr;
      }

      toast({
        title: "Account Created Successfully!",
        description: newUserId ? "Your organization has been set up." : "Please sign in with your credentials.",
        variant: "default",
      });
      navigate('/login');
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
          <LoginLeftColumn full />
        </div>

        {/* Right: Signup form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-2 sm:px-4 py-2 overflow-y-auto">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {`Hello ${formData.organizationName?.trim() ? formData.organizationName : 'there'}`}
                </h1>
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 animate-pulse">👋</span>
              </div>
              <p className="text-violet-600 font-medium mt-1 text-xs sm:text-sm">
                {showReview ? 'Confirm your registration' : 'Register your NGO'}
              </p>
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
                        <Label htmlFor="organizationType" className="text-xs font-medium">Organization Type</Label>
                        <Select
                          value={formData.organizationType}
                          onValueChange={(value) => updateField('organizationType', value)}
                          disabled={isLoading}
                          required
                        >
                          <SelectTrigger className="h-7 sm:h-8 mt-0.5 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGO">NGO</SelectItem>
                            <SelectItem value="Donor">Donor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
                            disabled={!module.available || isLoading || module.name === 'User Management'}
                          />
                          <Label
                            htmlFor={module.name}
                            className={`text-xs font-normal leading-tight cursor-pointer ${!module.available
                              ? 'text-muted-foreground cursor-not-allowed'
                              : module.name === 'User Management' ? 'opacity-70 cursor-not-allowed' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
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
                  {/* Review Section - Professional layout */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Confirm Registration Details</h3>

                    {/* Summary card */}
                    <div className="bg-white border rounded-md p-3 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="text-[11px] text-gray-500">Organization</div>
                          <div className="font-medium text-gray-900 truncate">{formData.organizationName || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-gray-500">Email</div>
                          <div className="font-medium text-gray-900 truncate">{formData.email}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-gray-500">Phone</div>
                          <div className="font-medium text-gray-900 truncate">{formData.contactPhone || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-gray-500">Country</div>
                          <div className="font-medium text-gray-900 truncate">{formData.country || '-'}</div>
                        </div>
                      </div>

                      {/* Modules */}
                      <div className="mt-3">
                        <div className="text-[11px] text-gray-500 mb-1">Selected Modules</div>
                        {formData.selectedModules.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {formData.selectedModules.map((m: string) => (
                              <span key={m} className="text-[11px] px-2 py-1 rounded-sm border bg-gray-50 text-gray-700">
                                {m}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">No modules selected</div>
                        )}
                      </div>
                    </div>

                    {/* Pricing plan box */}
                    {(() => {
                      const count = formData.selectedModules.length;
                      const isStandard = count <= 4; // up to 4 modules
                      const planName = isStandard ? 'Standard' : 'Business';
                      const price = isStandard ? 50 : 75; // per month
                      const annual = price * 12;
                      return (
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b">
                            <div className="text-sm font-medium">Subscription Plan</div>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold">{planName}</div>
                                <div className="text-[11px] text-gray-500">${price}/month (billed annually) • ${annual}/year</div>
                                {isStandard ? (
                                  <div className="text-[11px] text-gray-500 mt-1">Up to 4 modules selected. Need more? Upgrade to Business.</div>
                                ) : (
                                  <div className="text-[11px] text-gray-500 mt-1">Business tier for 5+ modules.</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center px-3 py-1 rounded-md bg-violet-50 text-violet-700 text-xs border border-violet-200">
                                  {count} module{count === 1 ? '' : 's'} selected
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={() => setShowPlanDetails(v => !v)}
                                      className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-violet-200 text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                                      aria-expanded={showPlanDetails}
                                      aria-label={showPlanDetails ? 'Hide plan details' : 'Show plan details'}
                                    >
                                      {showPlanDetails ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" align="center" className="text-xs">
                                    {showPlanDetails ? 'Hide plan details' : 'View plan features & notes'}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            {showPlanDetails && (
                              <div className="mt-3">
                                <ul className="space-y-1.5 text-[12px] text-gray-700">
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> User Management included free</li>
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> 5 Free Users Included</li>
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> 100GB Secure Cloud Storage</li>
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Pre‑configured Workflows & Modules</li>
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Email & Ticket Support</li>
                                  <li className="flex items-center gap-2 pt-1 border-t"><Check className="h-3.5 w-3.5 text-emerald-600" /> Admin Panel (users, roles, settings)</li>
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> SLA: Email & Ticket (2–3 business days)</li>
                                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> $5 per additional user/month</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Terms consent */}
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <input
                        id="terms"
                        type="checkbox"
                        className="mt-0.5 h-3.5 w-3.5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <label htmlFor="terms">
                        I agree to the <a className="underline underline-offset-2" href="#">Terms of Service</a> and <a className="underline underline-offset-2" href="#">Privacy Policy</a>.
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
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
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading || (showReview && !termsAccepted)}
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