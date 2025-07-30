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
      
      // Generate organization slug
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_organization_slug', { org_name: organizationData.organizationName });
      
      if (slugError) throw slugError;
      
      const redirectUrl = `${window.location.origin}/`;
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: organizationData.contactPersonName,
            organization_name: organizationData.organizationName,
            organization_type: organizationData.organizationType,
            organization_slug: slugData
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create organization
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: organizationData.organizationName,
            type: organizationData.organizationType,
            slug: slugData,
            address: organizationData.address,
            establishment_date: organizationData.establishmentDate,
            currency: organizationData.currency
          })
          .select()
          .single();

        if (orgError) throw orgError;

        // Create organization contact
        await supabase
          .from('organization_contacts')
          .insert({
            organization_id: orgData.id,
            name: organizationData.contactPersonName,
            email: email,
            phone: organizationData.contactPhone,
            is_primary: true
          });

        // Create user profile
        await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            organization_id: orgData.id,
            full_name: organizationData.contactPersonName,
            role: 'admin'
          });

        // Insert selected modules
        const moduleInserts = organizationData.selectedModules.map((moduleName: string) => ({
          organization_id: orgData.id,
          module_name: moduleName
        }));

        await supabase
          .from('organization_modules')
          .insert(moduleInserts);

        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account.",
        });
      }

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};