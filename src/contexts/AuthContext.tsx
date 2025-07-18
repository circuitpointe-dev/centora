
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
    email: "user@ngo.com",
    name: "Richard Nwamadi",
    organization: "FEHD Foundation",
    userType: "NGO",
    subscribedModules: ["fundraising", "grants", "documents"]
  },
  {
    id: "3",
    email: "user@donor.com",
    name: "Millicent Ogbu",
    organization: "AmplifyChange",
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
  const [user, setUser] = useState<User | null>(null);

  // Initialize user state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (storedUser && isAuthenticated === 'true') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || password.length < 6) {
      return false;
    }

    // Check if it's a predefined demo user
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    let loginUser: User;
    
    if (foundUser) {
      loginUser = foundUser;
    } else {
      // Create a new full modules user for any other email
      loginUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        organization: "Demo Organization",
        userType: "NGO",
        subscribedModules: ["fundraising", "grants", "documents", "programme", "procurement", "inventory", "finance", "learning", "hr", "users"]
      };
    }

    // Set user state and localStorage
    setUser(loginUser);
    localStorage.setItem('currentUser', JSON.stringify(loginUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    return true;
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
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
