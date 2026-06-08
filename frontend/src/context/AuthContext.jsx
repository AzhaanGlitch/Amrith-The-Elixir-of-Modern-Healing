import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LoadingScreen } from '../components/ui';

const AuthContext = createContext(null);
import { API_URL } from '../config';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('amrith_token');
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('amrith_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (role, credentials) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('amrith_token', data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (role, userData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('amrith_token', data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('amrith_token');
    setUser(null);
  }, []);

  const updateUserData = useCallback((newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, updateUserData, isAuthenticated: !!user }}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
