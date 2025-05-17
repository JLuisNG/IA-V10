// components/login/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GeolocationService from './GeolocationService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    currentUser: null,
    token: null,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          loading: false,
          currentUser: user,
          token,
          error: null
        });
      } catch (err) {
        clearAuthData();
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Invalid session data'
        }));
      }
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const login = async ({ token, user }) => {
    try {
      // ✅ Verificación de ubicación
      const geoResult = await GeolocationService.verifyLocationAccess();
      if (!geoResult.allowed) {
        return { success: false, error: 'Access denied due to geographic restriction.' };
      }

      // ✅ Guardar en localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        loading: false,
        currentUser: user,
        token,
        error: null
      });

      return { success: true };
    } catch (error) {
      console.error('Error during login context:', error);
      clearAuthData();
      setAuthState({
        isAuthenticated: false,
        loading: false,
        currentUser: null,
        token: null,
        error: error.message || 'Login error'
      });
      return { success: false, error: error.message || 'Login error' };
    }
  };

  const logout = () => {
    clearAuthData();
    setAuthState({
      isAuthenticated: false,
      loading: false,
      currentUser: null,
      token: null,
      error: null
    });
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        loading: authState.loading,
        currentUser: authState.currentUser,
        token: authState.token,
        error: authState.error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
