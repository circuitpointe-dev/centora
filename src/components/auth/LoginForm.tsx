
// src/components/auth/LoginForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";

interface LoginFormProps {
  onShowRegistration: () => void;
}

const LoginForm = ({ onShowRegistration }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Development users
  const isDevelopmentUser = (email: string) => {
    return email === 'user@ngo.com' || email === 'user@donor.com';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // For development users, setup their profiles first
      if (isDevelopmentUser(email)) {
        if (password !== "Circuit2025$") {
          toast({
            title: "Login Failed",
            description: "Invalid password for development account.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Setup development user
        await supabase.functions.invoke('setup-dev-user', {
          body: { email, password }
        });
      }

      const { error } = await signIn(email, password);

      if (!error) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/dashboard/fundraising/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center lg:justify-start justify-center px-2 sm:px-12">
      <div className="w-full max-w-xs sm:max-w-sm p-8 rounded-lg shadow-sm">
        {/* Welcome message */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <span className="h-6 w-6 text-yellow-500 animate-pulse">👋</span>
          </div>
          <p className="text-gray-500 mt-1">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 h-10 rounded-md border border-gray-300 bg-gray-50 focus-visible:ring-2 focus-visible:ring-violet-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-violet-600 hover:text-violet-500 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 h-10 rounded-md border border-gray-300 bg-gray-50 focus-visible:ring-2 focus-visible:ring-violet-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md py-2 text-base transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging In...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* "Create an account" link */}
        <p className="mt-6 text-center text-gray-500">
          New NGO?{" "}
          <button
            onClick={onShowRegistration}
            className="text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
          >
            Create an account
          </button>
        </p>

        {/* "Back to Home" link */}
        <div className="mt-4 text-center">
          <Link to="/">
            <Button
              variant="outline"
              className="text-gray-600 hover:text-violet-600 border-gray-300 hover:border-violet-500"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center text-xs text-gray-400">
          <div className="mb-4">
            © {new Date().getFullYear()} Orbit ERP. All rights reserved.
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
};

export default LoginForm;
