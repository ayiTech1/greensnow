// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureStore } from '@/utils/storage';
import api from '@/services/api';

type User = {
  email: string;
  role: string;
  isVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = await secureStore.getItem('access_token');
        if (accessToken) {
          const response = await api.get('/auth/me/');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    await secureStore.setItem('access_token', response.data.access);
    await secureStore.setItem('refresh_token', response.data.refresh);
    setUser(response.data.user);
  };

  const logout = async () => {
    await secureStore.deleteItem('access_token');
    await secureStore.deleteItem('refresh_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me/');
      setUser(response.data);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);