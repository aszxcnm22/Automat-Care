import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Admin' | 'ORG Admin' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  group: string; // For ORG Admin and Member, this is their specific group. For Admin, it might be 'All' or irrelevant.
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password?: string) => {
    let mockUser: User | null = null;

    // Admin
    if (email === 'admin@system.com' && password === 'admin123') {
        mockUser = {
            id: 'USR-001',
            name: 'Admin User',
            email: 'admin@system.com',
            role: 'Admin',
            group: 'All',
        };
    } 
    // ORG Admin
    else if (email === 'orgadmin@globaltech.com' && password === 'orgadmin123') {
        mockUser = {
            id: 'USR-002',
            name: 'Org Admin User',
            email: 'orgadmin@globaltech.com',
            role: 'ORG Admin',
            group: 'Global Tech Holdings Company',
        };
    } 
    // Member
    else if (email === 'member@globaltech.com' && password === 'member123') {
        mockUser = {
            id: 'USR-003',
            name: 'Member User',
            email: 'member@globaltech.com',
            role: 'Member',
            group: 'Global Tech Holdings Company',
        };
    }
    // Fallback for quick testing if needed (optional, but good to keep strict based on request)
    // Removing loose checks to strictly follow the requested credentials.

    if (mockUser) {
        setUser(mockUser);
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
