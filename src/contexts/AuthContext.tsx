
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'NGO' | 'Donor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, userType?: 'NGO' | 'Donor') => Promise<boolean>;
  logout: () => void;
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

// Helper function to determine user type from email
const determineUserTypeFromEmail = (email: string): 'NGO' | 'Donor' => {
  const domain = email.split('@')[1]?.toLowerCase();
  
  // Donor patterns
  const donorDomains = ['.foundation', '.fund', '.investment', '.capital', '.ventures'];
  const donorKeywords = ['foundation', 'fund', 'investment', 'capital', 'ventures', 'philanthropic'];
  
  // NGO patterns
  const ngoDomains = ['.org', '.ngo'];
  const ngoKeywords = ['ngo', 'nonprofit', 'charity', 'relief', 'aid', 'development'];
  
  // Check donor patterns
  if (donorDomains.some(pattern => domain?.includes(pattern)) ||
      donorKeywords.some(keyword => domain?.includes(keyword))) {
    return 'Donor';
  }
  
  // Check NGO patterns
  if (ngoDomains.some(pattern => domain?.includes(pattern)) ||
      ngoKeywords.some(keyword => domain?.includes(keyword))) {
    return 'NGO';
  }
  
  // Default to NGO if unclear
  return 'NGO';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserType = localStorage.getItem('userType') as 'NGO' | 'Donor' | null;
    
    if (isAuthenticated) {
      return {
        id: "1",
        email: "chioma.ike@ngo.org",
        name: "Chioma Ike",
        userType: storedUserType || 'NGO'
      };
    }
    return null;
  });

  // Sync localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', user.userType);
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userType');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - in real app, this would call your backend
    if (email && password.length >= 6) {
      const userType = determineUserTypeFromEmail(email);
      const newUser = {
        id: "1",
        email,
        name: "Chioma Ike", // For demo purposes, always use this name
        userType,
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    userType?: 'NGO' | 'Donor'
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (email && password.length >= 6 && name) {
      const finalUserType = userType || determineUserTypeFromEmail(email);
      const newUser = {
        id: "1",
        email,
        name,
        userType: finalUserType,
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // localStorage will be cleared by the useEffect
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
