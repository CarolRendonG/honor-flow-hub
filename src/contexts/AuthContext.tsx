import React, { createContext, useContext, useState, useCallback } from 'react';
import { MockUser, UserRole, mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = useCallback((role: UserRole) => {
    const found = mockUsers.find(u => u.role === role);
    if (found) setUser(found);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const switchRole = useCallback((role: UserRole) => {
    const found = mockUsers.find(u => u.role === role);
    if (found) setUser(found);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
