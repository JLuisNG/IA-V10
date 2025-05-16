// components/login/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GeolocationService from './GeolocationService';
// Removed createSessionTimeout import entirely

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    currentUser: null,
    token: null,
    error: null
  });

  // Removed sessionTimeoutWarning state
  // Removed sessionTimeout service

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for token
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');
        
        if (token && userData) {
          // Verify geolocation before restoring session
          const geoResult = await GeolocationService.verifyLocationAccess();
          
          if (!geoResult.allowed) {
            // Location restricted, log out
            clearAuthData();
            setAuthState({
              isAuthenticated: false,
              loading: false,
              currentUser: null,
              token: null,
              error: 'Geographic restriction'
            });
            return;
          }
          
          // Restore user data
          const user = JSON.parse(userData);
          
          setAuthState({
            isAuthenticated: true,
            loading: false,
            currentUser: user,
            token: token,
            error: null
          });
          
          // Removed session tracking start
        } else {
          // No stored auth
          setAuthState({
            isAuthenticated: false,
            loading: false,
            currentUser: null,
            token: null,
            error: null
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        clearAuthData();
        setAuthState({
          isAuthenticated: false,
          loading: false,
          currentUser: null,
          token: null,
          error: 'Authentication error'
        });
      }
    };
    
    checkAuth();
    
    // Removed cleanup function for session tracking
  }, []);

  // Clear auth data from localStorage
  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  // Login function
  const login = async (authData) => {
    try {
      // Verify location before logging in
      const geoResult = await GeolocationService.verifyLocationAccess();
      
      if (!geoResult.allowed) {
        return {
          success: false,
          error: 'Geographic restriction'
        };
      }
      
      // If authentication is successful
      if (authData.success && authData.token && authData.user) {
        // Store auth data
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('auth_user', JSON.stringify(authData.user));
        
        // Update state
        setAuthState({
          isAuthenticated: true,
          loading: false,
          currentUser: authData.user,
          token: authData.token,
          error: null
        });
        
        // Removed session timeout tracking start
        
        return { success: true };
      } else {
        throw new Error(authData.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Logout function
  const logout = () => {
    // Removed session tracking stop
    
    // Clear auth data
    clearAuthData();
    
    // Update state
    setAuthState({
      isAuthenticated: false,
      loading: false,
      currentUser: null,
      token: null,
      error: null
    });
    
    // Removed timeout warning reset
    
    // Redirigir al login
    window.location.href = '/';
  };

  // Removed extendSession function

  // Provide auth context
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
        // Removed sessionTimeoutWarning and extendSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;