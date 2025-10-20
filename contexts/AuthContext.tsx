import React, { createContext, useContext, useState, useEffect } from 'react';
import { githubAuth } from '../services/githubAuth';

interface User {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
  id: number;
}

interface AuthError {
  type: 'network' | 'auth' | 'token' | 'user';
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: () => void;
  logout: () => void;
  clearError: () => void;
  validateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('code') || urlParams.get('error')) {
          const { user: callbackUser, error: callbackError } = await githubAuth.handleCallback();
          
          if (callbackError) {
            setError(callbackError);
            setUser(null);
          } else if (callbackUser) {
            setUser(callbackUser);
            setError(null);
          }
        } else {
          // Check existing session
          const existingUser = githubAuth.getUser();
          const existingError = githubAuth.getError();
          
          if (existingError) {
            setError(existingError);
          }
          
          if (existingUser) {
            // Validate token is still valid
            const isValid = await githubAuth.validateToken();
            if (isValid) {
              setUser(existingUser);
              setError(null);
            } else {
              setUser(null);
              setError({
                type: 'token',
                message: 'Session expired. Please log in again.'
              });
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError({
          type: 'network',
          message: 'Failed to initialize authentication'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    setError(null);
    githubAuth.login();
  };

  const logout = () => {
    githubAuth.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
    githubAuth.clearError();
  };

  const validateSession = async (): Promise<boolean> => {
    if (!user) return false;
    
    const isValid = await githubAuth.validateToken();
    if (!isValid) {
      setUser(null);
      setError({
        type: 'token',
        message: 'Session expired. Please log in again.'
      });
    }
    return isValid;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      clearError,
      validateSession
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
