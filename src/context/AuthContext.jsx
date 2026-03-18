import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const mockUsers = {
  patient: {
    id: 'P001',
    name: 'Aditya Rajan',
    email: 'aditya@example.com',
    phone: '+91 98765 43210',
    role: 'patient',
    avatar: 'AR',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+',
    address: '42, 3rd Cross, HSR Layout, Bangalore - 560102',
  },
  doctor: {
    id: 'D001',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@amrith.com',
    phone: '+91 87654 32109',
    role: 'doctor',
    avatar: 'MI',
    specialization: 'Internal Medicine',
    experience: '12 years',
    qualification: 'MBBS, MD (Internal Medicine)',
    verified: true,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (role) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(mockUsers[role]);
    setIsLoading(false);
    return mockUsers[role];
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const signup = useCallback(async (role, data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { ...mockUsers[role], ...data };
    setUser(newUser);
    setIsLoading(false);
    return newUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, isAuthenticated: !!user }}>
      {children}
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
