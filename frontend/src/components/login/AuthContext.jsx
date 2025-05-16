// components/login/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GeolocationService from './GeolocationService';
import createSessionTimeout from './SessionTimeoutService';

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

  // Session timeout state
  const [sessionTimeoutWarning, setSessionTimeoutWarning] = useState({
    isOpen: false,
    remainingTime: 60 // Default 60 seconds warning
  });

  // Session timeout service
  const sessionTimeout = createSessionTimeout({
    timeout: 15 * 60 * 1000, // 15 minutes
    warningTime: 60 * 1000, // 1 minute warning
    onTimeout: () => {
      console.log('Session timed out');
      logout();
    },
    onWarning: (remainingSeconds) => {
      console.log(`Session will timeout in ${remainingSeconds} seconds`);
      setSessionTimeoutWarning({
        isOpen: true,
        remainingTime: remainingSeconds
      });
    },
    onActivityDetected: () => {
      console.log('User activity detected, hiding warning');
      setSessionTimeoutWarning({
        isOpen: false,
        remainingTime: 60
      });
    }
  });

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
          
          // Start session timeout tracking
          sessionTimeout.startTracking();
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
    
    // Cleanup session tracking on unmount
    return () => {
      sessionTimeout.stopTracking();
    };
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
        
        // Start session timeout tracking
        sessionTimeout.startTracking();
        
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
    // Stop session tracking
    sessionTimeout.stopTracking();
    
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
    
    // Close timeout warning if open
    setSessionTimeoutWarning({
      isOpen: false,
      remainingTime: 60
    });
    
    // Redirigir al login
    window.location.href = '/';
  };

  // Extend session
  const extendSession = () => {
    console.log('Extending session');
    sessionTimeout.extendSession();
    
    // Hide warning
    setSessionTimeoutWarning({
      isOpen: false,
      remainingTime: 60
    });
  };

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
        logout,
        sessionTimeoutWarning,
        extendSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;