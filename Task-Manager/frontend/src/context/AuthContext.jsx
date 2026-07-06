import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tm_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tm_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('tm_token', token);
    else localStorage.removeItem('tm_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('tm_user', JSON.stringify(user));
    else localStorage.removeItem('tm_user');
  }, [user]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = (payload) => api.signup(payload);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
