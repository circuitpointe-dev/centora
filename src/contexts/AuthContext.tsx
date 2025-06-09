
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      return {
        id: "1",
        email: "chioma.ike@ngo.org",
        name: "Chioma Ike"
      };
    }
    return null;
  });

  // Sync localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - in real app, this would call your backend
    if (email && password.length >= 6) {
      const newUser = {
        id: "1",
        email,
        name: "Chioma Ike", // For demo purposes, always use this name
      };
      setUser(newUser);
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

    // Mock validation
    if (email && password.length >= 6 && name) {
      const newUser = {
        id: "1",
        email,
        name,
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
