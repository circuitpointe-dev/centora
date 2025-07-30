import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SupabaseLoginFormProps {
  onShowRegistration: () => void;
}

const SupabaseLoginForm = ({ onShowRegistration }: SupabaseLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Development users
  const isDevelopmentUser = (email: string) => {
    return email === 'user@ngo.com' || email === 'user@donor.com';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your organization account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onShowRegistration}
                className="text-primary font-medium hover:underline"
              >
                Register your organization
              </button>
            </p>
          </div>

          {/* Development accounts info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Development Accounts:</p>
            <p className="text-xs text-blue-600">NGO: user@ngo.com</p>
            <p className="text-xs text-blue-600">Donor: user@donor.com</p>
            <p className="text-xs text-blue-600">Password: Circuit2025$</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseLoginForm;