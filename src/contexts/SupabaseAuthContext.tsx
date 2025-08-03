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
  userType: 'NGO' | 'Donor' | null;
  organizationName: string | null;
  subscribedModules: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
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
        .select(`*, organization:organizations(*)`)
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };


  // Listen for auth events
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Get existing session
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
      
      // Step 1: Create organization and related data
      const { data: rpcResponse, error: rpcError } = await supabase.rpc('register_organization_and_user' as any, {
        p_org_name: organizationData.organizationName,
        p_org_type: organizationData.organizationType,
        p_user_email: email,
        p_user_password: password,
        p_full_name: organizationData.contactPersonName,
        p_selected_modules: organizationData.selectedModules || ["Fundraising", "Documents Manager"],
        p_address: organizationData.address || null,
        p_establishment_date: organizationData.establishmentDate || null,
        p_currency: organizationData.currency || 'USD',
        p_contact_phone: organizationData.contactPhone || null
      });

      if (rpcError) {
        console.error('Organization creation failed:', rpcError);
        return { error: rpcError };
      }

      if (rpcResponse?.error) {
        console.error('Organization creation error:', rpcResponse.error);
        return { error: { message: rpcResponse.error } };
      }

      // Step 2: Create user account (without email verification)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: null, // Disable email verification
          data: {
            full_name: organizationData.contactPersonName,
            organization_id: rpcResponse.organization_id
          }
        }
      });

      if (authError) {
        console.error('User creation failed:', authError);
        return { error: authError };
      }

      // Step 3: Link user to organization (if user is immediately available)
      if (authData.user) {
        const { error: completeError } = await supabase.rpc('complete_registration_transaction' as any, {
          p_user_id: authData.user.id,
          p_org_id: rpcResponse.organization_id
        });

        if (completeError) {
          console.error('Registration completion failed:', completeError);
          return { error: completeError };
        }
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    userType: profile?.organization?.type || null,
    organizationName: profile?.organization?.name || null,
    subscribedModules: [], // TODO: pull from DB if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
