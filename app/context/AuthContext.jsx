"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../lib/api";
import { setToken, getToken, removeToken } from "../lib/cookies";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      // Try to get user info from token (basic check)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ userId: payload.userId });
      } catch {
        // Invalid token
        removeToken();
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authAPI.login(email, password);
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (email, password, name) => {
    const result = await authAPI.register(email, password, name);
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
