
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  userType: 'NGO' | 'Donor';
  subscribedModules: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Hardcoded users for demonstration
const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "chioma@cp.com",
    name: "Chioma Ike",
    organization: "CircuitPointe",
    userType: "NGO",
    subscribedModules: ["fundraising", "grants", "documents", "programme", "procurement", "inventory", "finance", "learning", "hr", "users"]
  },
  {
    id: "2",
    email: "richard@fehd.com",
    name: "Richard Nwamadi",
    organization: "FEHD Foundation",
    userType: "NGO",
    subscribedModules: ["fundraising", "grants", "documents"]
  },
  {
    id: "3",
    email: "millicent@amplify.com",
    name: "Millicent Ogbu",
    organization: "AmplifyChange",
    userType: "Donor",
    subscribedModules: ["grants"]
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
  // Initialize user state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    return null;
  });

  // Sync localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, registration creates a new NGO user with basic modules
    if (email && password.length >= 6 && name) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        organization: "Demo Organization",
        userType: "NGO",
        subscribedModules: ["fundraising", "grants", "documents"]
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
