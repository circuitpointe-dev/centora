import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'Donor';
  slug: string;
  status: 'pending_verification' | 'active' | 'suspended';
}

interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  role: string;
  organization?: Organization;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, organizationData: any, captchaToken: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithOAuth: (organizationName: string, organizationType: 'NGO' | 'Donor', provider: 'google' | 'azure') => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  // Convenience properties from profile
  userType: 'NGO' | 'Donor' | null;
  organizationName: string | null;
  subscribedModules: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

useEffect(() => {
  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          await handleRegistrationCompletion(session.user.id);
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }

      setLoading(false);
    }
  );

  // Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      fetchProfile(session.user.id);
    }
    setLoading(false);
  });

  return () => subscription.unsubscribe();
}, []);


const handleRegistrationCompletion = async (userId: string) => {
  try {
    // Check if user already has a profile (existing user)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      // User already exists, no need to complete registration
      return;
    }

    // Check for pending OAuth registration
    const pendingOrg = sessionStorage.getItem('pendingOrgRegistration');
    if (pendingOrg) {
      const { organizationName, organizationType, organizationId } = JSON.parse(pendingOrg);

      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          organization_id: organizationId,
          full_name: user.data.user.user_metadata?.full_name || user.data.user.email?.split('@')[0] || 'User',
          role: 'admin'
        });

      if (profileError) throw profileError;

      const { error: updateOrgError } = await supabase
        .from('organizations')
        .update({ primary_user_id: userId })
        .eq('id', organizationId);

      if (updateOrgError) throw updateOrgError;

      const { error: contactError } = await supabase
        .from('organization_contacts')
        .insert({
          organization_id: organizationId,
          name: user.data.user.user_metadata?.full_name || organizationName,
          email: user.data.user.email || '',
          is_primary: true
        });

      if (contactError) throw contactError;

      const { error: moduleError } = await supabase
        .from('organization_modules')
        .insert([
          { organization_id: organizationId, module_name: 'Fundraising' },
          { organization_id: organizationId, module_name: 'Documents Manager' }
        ]);

      if (moduleError) throw moduleError;

      sessionStorage.removeItem('pendingOrgRegistration');

      toast({
        title: "Welcome to Orbit ERP!",
        description: `${organizationName} has been successfully registered.`,
      });

      window.location.href = '/dashboard/fundraising';
      return;
    }

    // Check for pending email registration
    const pendingEmail = sessionStorage.getItem('pendingEmailRegistration');
    if (pendingEmail) {
      const { organizationId } = JSON.parse(pendingEmail);

      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          organization_id: organizationId,
          full_name: user.data.user.user_metadata?.full_name || user.data.user.email?.split('@')[0] || 'User',
          role: 'admin'
        });

      if (profileError) throw profileError;

      const { error: updateOrgError } = await supabase
        .from('organizations')
        .update({ primary_user_id: userId })
        .eq('id', organizationId);

      if (updateOrgError) throw updateOrgError;

      sessionStorage.removeItem('pendingEmailRegistration');

      toast({
        title: "Registration Complete!",
        description: `Your account has been successfully created.`,
      });

      window.location.href = '/dashboard/fundraising';
      return;
    }
  } catch (error) {
    console.error('Registration completion error:', error);
    sessionStorage.removeItem('pendingOrgRegistration');
    sessionStorage.removeItem('pendingEmailRegistration');
  }
};


  const signUp = async (email: string, password: string, organizationData: any, captchaToken: string) => {
    try {
      setLoading(true);

      // Step 1: Call the register_organization_and_user RPC
      const { data: rpcResponse, error: rpcError } = await supabase.rpc('register_organization_and_user' as any, {
        p_org_name: organizationData.organizationName,
        p_org_type: organizationData.organizationType,
        p_user_email: email,
        p_user_password: password,
        p_full_name: organizationData.contactPersonName || organizationData.organizationName,
        p_selected_modules: organizationData.selectedModules || ["Fundraising", "Documents Manager"],
        p_address: organizationData.address || null,
        p_establishment_date: organizationData.establishmentDate || null,
        p_currency: organizationData.currency || 'USD',
        p_contact_phone: organizationData.contactPhone || null
      });

      if (rpcError || rpcResponse?.error) {
        throw rpcError || new Error(rpcResponse.error);
      }

      const newOrganizationId = (rpcResponse as any)?.organization_id;
      // Store the newOrganizationId in session storage for the listener
      sessionStorage.setItem('pendingEmailRegistration', JSON.stringify({ organizationId: newOrganizationId }));


      // Step 2: Sign up the user (sends confirmation email)
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (authError) throw authError;

      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account and continue.",
      });
      return { error: null };
    } catch (error: any) {
      console.error('Final Registration error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithOAuth = async (organizationName: string, organizationType: 'NGO' | 'Donor', provider: 'google' | 'azure') => {
    try {
      setLoading(true);

      // Step 1: Create the Organization Record (using the RPC)
      // We create a dummy email and password that won't be used for auth
      const dummyEmail = `${organizationName.replace(/\s/g, '').toLowerCase()}_${Date.now()}@orbit.com`;
      const dummyPassword = Math.random().toString(36).slice(-8);

      const { data: rpcResponse, error: rpcError } = await supabase.rpc('register_organization_and_user' as any, {
        p_org_name: organizationName,
        p_org_type: organizationType,
        p_user_email: dummyEmail,
        p_user_password: dummyPassword,
        p_full_name: organizationName, // Placeholder
        p_selected_modules: ["Fundraising", "Documents Manager"],
        p_address: null,
        p_establishment_date: null,
        p_currency: 'USD',
        p_contact_phone: null
      });

      if (rpcError || rpcResponse?.error) {
        throw rpcError || new Error(rpcResponse.error);
      }
      const newOrganizationId = (rpcResponse as any)?.organization_id;

      // Store organization data for completion after OAuth
      sessionStorage.setItem('pendingOrgRegistration', JSON.stringify({
        organizationName,
        organizationType,
        organizationId: newOrganizationId
      }));

      // Step 2: Initiate OAuth flow
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider === 'azure' ? 'azure' : 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard/fundraising`
        }
      });

      if (oauthError) throw oauthError;

    } catch (error: any) {
      setLoading(false);
      console.error('OAuth signup error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signUpWithOAuth,
    signOut,
    isAuthenticated: !!user,
    // Convenience properties from profile
    userType: profile?.organization?.type || null,
    organizationName: profile?.organization?.name || null,
    subscribedModules: [], // TODO: Implement module subscriptions from database
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};