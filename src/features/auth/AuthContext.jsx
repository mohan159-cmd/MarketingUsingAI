import React, { createContext, useContext, useState, useEffect } from 'react';
import { nativeAuthClient } from './nativeAuthClient';

/**
 * Auth Context
 * Manages authentication state including user, token, and auth functions
 */
const AuthContext = createContext(null);

/**
 * Custom hook to use auth context
 * @returns {{user: object|null, token: string|null, signIn: Function, signOut: Function, signUp: Function, loading: boolean, error: string|null}}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Decode JWT token to extract user info (simple implementation)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Auth Provider Component
 * Wraps the app and provides authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing token in sessionStorage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('access_token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      setToken(storedToken);
      setUser(decoded);
    }
  }, []);

  /**
   * Sign in function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<void>}
   */
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await nativeAuthClient.signIn(email, password);
      
      // Store tokens
      setToken(response.access_token);
      sessionStorage.setItem('access_token', response.access_token);
      if (response.id_token) {
        sessionStorage.setItem('id_token', response.id_token);
      }
      
      // Decode and set user info
      const userInfo = decodeToken(response.id_token || response.access_token);
      setUser(userInfo);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up function
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {object} attributes - Additional user attributes (givenName, surname, etc.)
   * @returns {Promise<void>}
   */
  const signUp = async (email, password, attributes = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await nativeAuthClient.signUp(email, password, attributes);
      
      // Store tokens
      setToken(response.access_token);
      sessionStorage.setItem('access_token', response.access_token);
      if (response.id_token) {
        sessionStorage.setItem('id_token', response.id_token);
      }
      
      // Decode and set user info
      const userInfo = decodeToken(response.id_token || response.access_token);
      setUser(userInfo);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out function
   */
  const signOut = () => {
    setUser(null);
    setToken(null);
    setError(null);
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
  };

  const value = {
    user,
    token,
    signIn,
    signOut,
    signUp,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
