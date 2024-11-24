import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'idle' | 'dnd';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login for demo purposes
    const mockUser: User = {
      id: '1',
      username: 'DemoUser',
      discriminator: '0001',
      status: 'online'
    };
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  async function signIn(username: string, password: string) {
    const mockUser: User = {
      id: '1',
      username,
      discriminator: '0001',
      status: 'online'
    };
    
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  }

  async function signOut() {
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
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