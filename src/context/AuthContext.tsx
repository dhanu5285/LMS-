import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('wealthmap_token');
    const storedUser = localStorage.getItem('wealthmap_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Connect to dummy endpoints: POST /auth/login
      const response = await api.post('/auth/login', { email, password });
      
      // Assume API returns user object and JWT token
      const mockToken = response.data.token || 'dummy_jwt_token_wealthmap';
      const mockUser = response.data.user || { name: email.split('@')[0], email };

      // Update state
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('wealthmap_token', mockToken);
      localStorage.setItem('wealthmap_user', JSON.stringify(mockUser));
    } catch (error) {
      // Fallback to local login if API server is not running (Mock Mode)
      console.warn('Backend server not active. Simulating mock authentication fallback...', error);
      
      const mockToken = 'dummy_jwt_token_wealthmap';
      const mockUser = { name: email.split('@')[0], email };

      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('wealthmap_token', mockToken);
      localStorage.setItem('wealthmap_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Connect to dummy endpoints: POST /auth/register
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      console.warn('Backend server not active. Simulating mock registration fallback...', error);
      // Fail silently and allow mock redirect in frontend
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('wealthmap_token');
    localStorage.removeItem('wealthmap_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
