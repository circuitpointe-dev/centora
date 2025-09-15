import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { allModules } from "@/config/moduleConfigs";

// Updated AppUser interface to include is_super_admin
interface AppUser {
  id: string;
  email: string;
  name: string;
  organization: string;
  org_id?: string;
  userType: 'NGO' | 'Donor' | 'SuperAdmin'; // Added SuperAdmin userType
  is_super_admin: boolean; // Added new field
  subscribedModules: string[];
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: { code?: string; message: string } }>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Removed hardcoded demo users - using real Supabase authentication only

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Load profile + org + modules for Supabase users
  const fetchProfileAndModules = async (userId: string) => {
    try {
      // Fetch profile data, including the new `is_super_admin` column
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, org_id, is_super_admin')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('Error loading profile:', profileError);
        return;
      }

      // If the user is a Super Admin, their org-related data is null
      const isSuperAdmin = profile.is_super_admin;
      let orgName = '';
      let orgType: 'NGO' | 'Donor' | 'SuperAdmin' = 'NGO';
      let subscribedModules: string[] = [];

      if (isSuperAdmin) {
        orgName = 'Centora ERP';
        orgType = 'SuperAdmin';
        // Super Admins have access to all modules
        subscribedModules = Object.values(allModules);
      } else if (profile.org_id) {
        // Regular user, fetch organization and subscribed modules
        const [{ data: org, error: orgError }, { data: modulesData, error: modulesError }] = await Promise.all([
          supabase.from('organizations').select('name, type').eq('id', profile.org_id).single(),
          supabase.from('organization_modules').select('module').eq('org_id', profile.org_id),
        ]);

        if (orgError) console.error('Error loading organization:', orgError);
        if (modulesError) console.error('Error loading modules:', modulesError);

        orgName = org?.name || '';
        orgType = (org?.type as 'NGO' | 'Donor' | undefined) ?? 'NGO';
        
        const normalizedModules = (modulesData || [])
          .map((m: any) => String(m.module).toLowerCase())
          .filter((m: string) => allModules.includes(m));

        // Ensure 'users' module is always present for NGOs
        if (orgType === 'NGO' && !normalizedModules.includes('users')) {
          normalizedModules.push('users');
        }

        subscribedModules = normalizedModules.length > 0
          ? normalizedModules
          : ['fundraising', 'documents'].filter((m) => allModules.includes(m));
      } else {
        // Handle users with no org_id (not a Super Admin)
        console.warn("User has no org_id or is not a Super Admin. Subscribing to base modules.");
        subscribedModules = ['fundraising', 'documents'].filter((m) => allModules.includes(m));
      }

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.full_name || profile.email,
        organization: orgName,
        org_id: profile.org_id,
        userType: orgType,
        is_super_admin: isSuperAdmin,
        subscribedModules: subscribedModules,
      });
    } catch (error) {
      console.error('Auth profile load error:', error);
    }
  };

  // Initialize auth listeners and existing session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      if (sess?.user) {
        // set a minimal placeholder user immediately
        setUser(prev => prev ?? {
          id: sess.user.id,
          email: sess.user.email || '',
          name: (sess.user.user_metadata as any)?.full_name || sess.user.email || 'User',
          organization: '',
          userType: 'NGO',
          is_super_admin: false,
          subscribedModules: []
        });
        // defer fetching profile to avoid deadlocks
        setTimeout(() => fetchProfileAndModules(sess.user!.id), 0);
      } else {
        setUser(null);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(prev => prev ?? {
          id: session.user.id,
          email: session.user.email || '',
          name: (session.user.user_metadata as any)?.full_name || session.user.email || 'User',
          organization: '',
          userType: 'NGO',
          is_super_admin: false,
          subscribedModules: []
        });
        setTimeout(() => fetchProfileAndModules(session.user!.id), 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: { code?: string; message: string } }> => {
    // Use Supabase authentication only
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = (error as any)?.message || 'Authentication failed';
      const code = msg.toLowerCase().includes('email not confirmed') ? 'email_not_confirmed' : (error as any)?.code;
      return { success: false, error: { code, message: msg } };
    }
    // session listener will populate user state
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    return { success: true };
  };
  // Real user registration through Supabase
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    
    return !error;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: Boolean(session?.user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};