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
  signUp: (email: string, password: string, organizationData: any) => Promise<{ error?: any }>;
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
          // Check if this is a new OAuth user completing registration
          setTimeout(async () => {
            await handleOAuthRegistrationCompletion(session.user.id);
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

  const handleOAuthRegistrationCompletion = async (userId: string) => {
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

      // Get stored organization data from sessionStorage
      const storedOrgData = sessionStorage.getItem('pendingOrgRegistration');
      if (!storedOrgData) {
        // No pending registration data
        return;
      }

      const { organizationName, organizationType, organizationId } = JSON.parse(storedOrgData);

      // Complete the registration process
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          organization_id: organizationId,
          full_name: user.data.user.user_metadata?.full_name || user.data.user.email?.split('@')[0] || 'User',
          role: 'admin'
        });

      if (profileError) throw profileError;

      // Update organization with primary user
      const { error: updateOrgError } = await supabase
        .from('organizations')
        .update({ primary_user_id: userId })
        .eq('id', organizationId);

      if (updateOrgError) throw updateOrgError;

      // Create organization contact
      const { error: contactError } = await supabase
        .from('organization_contacts')
        .insert({
          organization_id: organizationId,
          name: user.data.user.user_metadata?.full_name || organizationName,
          email: user.data.user.email || '',
          is_primary: true
        });

      if (contactError) throw contactError;

      // Create default modules (Fundraising and Documents Manager)
      const { error: moduleError } = await supabase
        .from('organization_modules')
        .insert([
          { organization_id: organizationId, module_name: 'Fundraising' },
          { organization_id: organizationId, module_name: 'Documents Manager' }
        ]);

      if (moduleError) throw moduleError;

      // Clear stored data and show success
      sessionStorage.removeItem('pendingOrgRegistration');
      
      toast({
        title: "Welcome to Orbit ERP!",
        description: `${organizationName} has been successfully registered.`,
      });

      // Redirect to dashboard
      window.location.href = '/dashboard/fundraising';

    } catch (error) {
      console.error('OAuth registration completion error:', error);
      // Clean up stored data on error
      sessionStorage.removeItem('pendingOrgRegistration');
    }
  };

  const signUp = async (email: string, password: string, organizationData: any) => {
    try {
      setLoading(true);
      
      // Ensure we're in a clean anonymous state
      await supabase.auth.signOut();
      
      // Small delay to ensure the client is truly anonymous
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 1: Create the Organization Record (as `anon` user)
      const slugResponse = await supabase.rpc('generate_organization_slug', { 
        org_name: organizationData.organizationName 
      });
      
      if (slugResponse.error) throw slugResponse.error;
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationData.organizationName,
          email: organizationData.email,
          type: organizationData.organizationType,
          slug: slugResponse.data,
          address: organizationData.address || '',
          establishment_date: organizationData.establishmentDate || null,
          currency: organizationData.currency || 'USD'
        })
        .select()
        .single();

      if (orgError) throw orgError;
      const newOrganizationId = orgData.id;

      // Step 2: Register the Primary User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            organization_id: newOrganizationId,
            organization_name: organizationData.organizationName,
            organization_type: organizationData.organizationType
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User registration failed');

      // Step 3: Create the Primary User's Profile (as `authenticated` user)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          organization_id: newOrganizationId,
          full_name: organizationData.contactPersonName || organizationData.organizationName,
          role: 'admin'
        });

      if (profileError) throw profileError;

      // Step 4: Update Organization's primary_user_id (as `authenticated` user)
      const { error: updateOrgError } = await supabase
        .from('organizations')
        .update({ primary_user_id: authData.user.id })
        .eq('id', newOrganizationId);

      if (updateOrgError) throw updateOrgError;

      // Step 5: Create Organization Contacts (as `authenticated` user)
      const { error: contactError } = await supabase
        .from('organization_contacts')
        .insert({
          organization_id: newOrganizationId,
          name: organizationData.contactPersonName,
          email: organizationData.email,
          phone: organizationData.contactPhone,
          is_primary: true
        });

      if (contactError) throw contactError;

      // Step 6: Create Organization Modules (as `authenticated` user)
      if (organizationData.selectedModules && organizationData.selectedModules.length > 0) {
        const moduleInserts = organizationData.selectedModules.map((moduleName: string) => ({
          organization_id: newOrganizationId,
          module_name: moduleName
        }));

        const { error: moduleError } = await supabase
          .from('organization_modules')
          .insert(moduleInserts);

        if (moduleError) throw moduleError;
      }

      // Auto-login success - user is already authenticated
      toast({
        title: "Registration Successful",
        description: `Welcome to Orbit ERP, ${organizationData.organizationName}!`,
      });

      return { error: null };
    } catch (error: any) {
      console.error('Registration error:', error);
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

      // Step 1: Create the Organization Record (as anon user)
      const slugResponse = await supabase.rpc('generate_organization_slug', { 
        org_name: organizationName 
      });
      
      if (slugResponse.error) throw slugResponse.error;
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          email: '', // Will be filled after OAuth
          type: organizationType,
          slug: slugResponse.data,
          address: '',
          establishment_date: null,
          currency: 'USD'
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Store organization data for completion after OAuth
      sessionStorage.setItem('pendingOrgRegistration', JSON.stringify({
        organizationName,
        organizationType,
        organizationId: orgData.id
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