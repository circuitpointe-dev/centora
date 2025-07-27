
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

// Authorized users for development
const AUTHORIZED_USERS: User[] = [
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

    // Validate password length (must be exactly 8 characters)
    if (!email || password.length !== 8) {
      return false;
    }

    // Only allow authorized users
    const foundUser = AUTHORIZED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      return false; // Unauthorized email
    }

    // Set user state and localStorage
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
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
