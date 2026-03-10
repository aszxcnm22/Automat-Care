import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Admin' | 'ORG Admin' | 'Member' | 'GUEST';

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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
    // ORG Admin 2 (Green Energy Group)
    else if (email === 'orgadmin@greenenergy.com' && password === 'orgadmin123') {
        mockUser = {
            id: 'USR-004',
            name: 'Green Energy Org Admin',
            email: 'orgadmin@greenenergy.com',
            role: 'ORG Admin',
            group: 'Green Energy Group',
        };
    } 
    // Member 2 (Green Energy Group)
    else if (email === 'member@greenenergy.com' && password === 'member123') {
        mockUser = {
            id: 'USR-005',
            name: 'Green Energy Member',
            email: 'member@greenenergy.com',
            role: 'Member',
            group: 'Green Energy Group',
        };
    }
    // Guest
    else if (email === 'guest@system.com' && password === 'guest123') {
        mockUser = {
            id: 'USR-006',
            name: 'Guest User',
            email: 'guest@system.com',
            role: 'GUEST',
            group: '',
        };
    }

    if (mockUser) {
        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        // Record Login History
        const history = JSON.parse(localStorage.getItem('access_history') || '[]');
        history.unshift({
          id: `LOG-${Date.now()}`,
          user: mockUser.name,
          email: mockUser.email,
          action: 'Login',
          date: new Date().toISOString()
        });
        localStorage.setItem('access_history', JSON.stringify(history));

        return true;
    }
    return false;
  };

  const logout = () => {
    if (user) {
      // Record Logout History
      const history = JSON.parse(localStorage.getItem('access_history') || '[]');
      history.unshift({
        id: `LOG-${Date.now()}`,
        user: user.name,
        email: user.email,
        action: 'Logout',
        date: new Date().toISOString()
      });
      localStorage.setItem('access_history', JSON.stringify(history));
    }

    setUser(null);
    localStorage.removeItem('auth_user');
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
