'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Client {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
}

interface AuthContextType {
  client: Client | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, fullName: string, companyName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage for stored auth session
    const storedClient = localStorage.getItem('authClient');
    if (storedClient) {
      try {
        const parsedClient = JSON.parse(storedClient);
        setClient(parsedClient);
        setIsLoggedIn(true);
      } catch (err) {
        localStorage.removeItem('authClient');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would call your API
    // For now, simulate the login
    const mockClient: Client = {
      id: 'mock-id-' + Date.now(),
      email,
      fullName: 'User',
      companyName: 'Company',
    };
    setClient(mockClient);
    setIsLoggedIn(true);
    localStorage.setItem('authClient', JSON.stringify(mockClient));
  };

  const signup = async (email: string, password: string, fullName: string, companyName: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName, companyName }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.error || 'Unable to create account.');
    }

    const createdClient: Client = {
      id: result.id,
      email: result.email,
      fullName,
      companyName,
    };

    setClient(createdClient);
    setIsLoggedIn(true);
    localStorage.setItem('authClient', JSON.stringify(createdClient));
  };

  const logout = () => {
    setClient(null);
    setIsLoggedIn(false);
    localStorage.removeItem('authClient');
  };

  return (
    <AuthContext.Provider value={{ client, isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
