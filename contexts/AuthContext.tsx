import React, { createContext, useContext, useState, useEffect } from 'react';
import { githubAuth } from '../services/githubAuth';

interface User {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check for OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('code')) {
        const user = await githubAuth.handleCallback();
        setUser(user);
      } else {
        // Check existing session
        const existingUser = githubAuth.getUser();
        setUser(existingUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    githubAuth.login();
  };

  const logout = () => {
    githubAuth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
