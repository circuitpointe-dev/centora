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
          // Fetch user profile when authenticated
          setTimeout(() => {
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

  const signUp = async (email: string, password: string, organizationData: any) => {
    try {
      setLoading(true);
      
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
          name: organizationData.contactPersonName || organizationData.organizationName,
          email: organizationData.email,
          phone: organizationData.contactPhone || '',
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
    signOut,
    isAuthenticated: !!user,
    // Convenience properties from profile
    userType: profile?.organization?.type || null,
    organizationName: profile?.organization?.name || null,
    subscribedModules: [], // TODO: Implement module subscriptions from database
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};