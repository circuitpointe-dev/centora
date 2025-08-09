
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface AppUser {
  id: string;
  email: string;
  name: string;
  organization: string;
  userType: 'NGO' | 'Donor';
  subscribedModules: string[];
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Authorized users for development
const AUTHORIZED_USERS: AppUser[] = [
  {
    id: "1",
    email: "user@ngo.com",
    name: "NGO User",
    organization: "Demo NGO Organization",
    userType: "NGO",
    subscribedModules: ["fundraising", "grants", "documents", "programme", "procurement", "inventory", "finance", "learning", "hr", "users"]
  },
  {
    id: "2",
    email: "user@donor.com",
    name: "Donor User",
    organization: "Demo Donor Organization",
    userType: "Donor",
    subscribedModules: ["fundraising", "grants", "documents", "programme", "procurement", "inventory", "finance", "learning", "hr", "users"]
  }
];

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
  const [authMode, setAuthMode] = useState<"dev" | "supabase" | null>(null);

  // Load profile + org + modules for Supabase users
  const fetchProfileAndModules = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, org_id')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('Error loading profile:', profileError);
        return;
      }

      const [{ data: org, error: orgError }, { data: modulesData, error: modulesError }] = await Promise.all([
        supabase.from('organizations').select('name').eq('id', profile.org_id).single(),
        supabase.from('organization_modules').select('module').eq('org_id', profile.org_id),
      ]);

      if (orgError) console.error('Error loading organization:', orgError);
      if (modulesError) console.error('Error loading modules:', modulesError);

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.full_name || profile.email,
        organization: org?.name || '',
        userType: 'NGO',
        subscribedModules: (modulesData || []).map((m: any) => String(m.module)),
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
        setAuthMode('supabase');
        // set a minimal placeholder user immediately
        setUser(prev => prev ?? {
          id: sess.user.id,
          email: sess.user.email || '',
          name: (sess.user.user_metadata as any)?.full_name || sess.user.email || 'User',
          organization: '',
          userType: 'NGO',
          subscribedModules: []
        });
        // defer fetching profile to avoid deadlocks
        setTimeout(() => fetchProfileAndModules(sess.user!.id), 0);
      } else {
        if (authMode === 'supabase') {
          setUser(null);
        }
        setAuthMode(null);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setAuthMode('supabase');
        setUser(prev => prev ?? {
          id: session.user.id,
          email: session.user.email || '',
          name: (session.user.user_metadata as any)?.full_name || session.user.email || 'User',
          organization: '',
          userType: 'NGO',
          subscribedModules: []
        });
        setTimeout(() => fetchProfileAndModules(session.user!.id), 0);
      } else {
        // Fallback to dev-mode localStorage
        const storedUser = localStorage.getItem('currentUser');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (storedUser && isAuthenticated === 'true') {
          try {
            const parsedUser = JSON.parse(storedUser) as AppUser;
            setUser(parsedUser);
            setAuthMode('dev');
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isAuthenticated');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Dev accounts
    const foundUser = AUTHORIZED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser && password === "Circuit2025$") {
      try {
        await supabase.auth.signOut().catch(() => {}); // ensure no lingering Supabase session
      } catch {}
      setUser(foundUser);
      setAuthMode('dev');
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }

    // Supabase auth for real users
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return false;
    }
    // session listener will populate user state
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    setAuthMode('supabase');
    return true;
  };

  // Keeping existing register for compatibility (ModalSignup handles real signup)
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    // Simulated dev registration (unchanged)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email && password.length >= 6 && name) {
      const newUser: AppUser = {
        id: Date.now().toString(),
        email,
        name,
        organization: "Demo Organization",
        userType: "NGO",
        subscribedModules: ["fundraising", "grants", "documents"]
      };
      setUser(newUser);
      setAuthMode('dev');
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      if (authMode === 'supabase') {
        await supabase.auth.signOut();
      }
    } finally {
      setUser(null);
      setSession(null);
      setAuthMode(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user || !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
