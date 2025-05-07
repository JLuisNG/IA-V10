// components/login/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import createSessionTimeout from './SessionTimeoutService';
import { checkGeolocation } from './GeolocationService'; // Importaremos este servicio después

// Crear el contexto
const AuthContext = createContext();

// Crear un hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeoutWarning, setSessionTimeoutWarning] = useState({
    isOpen: false,
    remainingTime: 0
  });
  
  // Instancia del servicio de timeout
  const sessionTimeout = createSessionTimeout({
    timeout: 15 * 60 * 1000, // 
    warningTime: 60 * 1000, // Advertencia 1 minuto antes
    onTimeout: handleSessionTimeout,
    onWarning: handleSessionWarning,
    onActivityDetected: handleUserActivity
  });
  
  // Funciones para manejar eventos de sesión
  function handleSessionTimeout() {
    logout();
  }
  
  function handleSessionWarning(remainingSeconds) {
    setSessionTimeoutWarning({
      isOpen: true,
      remainingTime: remainingSeconds
    });
  }
  
  function handleUserActivity() {
    setSessionTimeoutWarning({
      isOpen: false,
      remainingTime: 0
    });
  }
  
  // Extender la sesión
  function extendSession() {
    setSessionTimeoutWarning({
      isOpen: false,
      remainingTime: 0
    });
    sessionTimeout.extendSession();
  }
  
  // Efectos para cargar datos de autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un token almacenado
        const authToken = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (authToken && userData) {
          // Verificar geolocalización antes de autenticar
          const geoResult = await checkGeolocation();
          
          if (!geoResult.allowed) {
            // No se permite el acceso desde esta ubicación
            setIsAuthenticated(false);
            setCurrentUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setLoading(false);
            return;
          }
          
          // Verificar sesiones concurrentes (implementaremos esto más adelante)
          const sessionToken = localStorage.getItem('session_token');
          const lastPingTime = localStorage.getItem('last_ping_time');
          
          // Si hay un token y datos de usuario válidos, autenticar
          setCurrentUser(JSON.parse(userData));
          setIsAuthenticated(true);
          
          // Iniciar el servicio de timeout de sesión
          sessionTimeout.startTracking();
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Cleanup
    return () => {
      sessionTimeout.stopTracking();
    };
  }, []);
  
  // Función de login
  const login = async (authData) => {
    try {
      // Verificar geolocalización
      const geoResult = await checkGeolocation();
      
      if (!geoResult.allowed) {
        return {
          success: false,
          error: 'Access denied from your location'
        };
      }
      
      // Generar token de sesión único
      const sessionToken = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      
      // Guardar datos en localStorage
      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('user_data', JSON.stringify(authData.user));
      localStorage.setItem('session_token', sessionToken);
      localStorage.setItem('last_ping_time', Date.now().toString());
      
      // Actualizar estado
      setCurrentUser(authData.user);
      setIsAuthenticated(true);
      
      // Iniciar tracking de timeout
      sessionTimeout.startTracking();
      
      // Iniciar ping para control de sesiones concurrentes
      startSessionPing(sessionToken, authData.user.username);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  };
  
  // Función de logout
  const logout = () => {
    // Detener tracking de timeout
    sessionTimeout.stopTracking();
    
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('session_token');
    localStorage.removeItem('last_ping_time');
    
    // Actualizar estado
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    // Redirigir a la página de login
    window.location.href = '/';
  };
  
  // Función para iniciar ping periódico para verificar sesiones concurrentes
  const startSessionPing = (sessionToken, username) => {
    const pingInterval = 30000; // 30 segundos
    
    // Función para realizar ping
    const pingSession = async () => {
      try {
        // Simular solicitud de ping al servidor (en producción, esto sería una solicitud real)
        const pingTime = Date.now();
        localStorage.setItem('last_ping_time', pingTime.toString());
        
        // Simular verificación de sesiones concurrentes (más adelante implementaremos esto)
        const isConcurrentSession = await checkConcurrentSessions(username, sessionToken);
        
        if (isConcurrentSession) {
          // Si se detectó una sesión concurrente, mostrar modal y cerrar sesión
          alert('Your account has been logged in from another device. You will be logged out.');
          logout();
        }
      } catch (error) {
        console.error('Error pinging session:', error);
      }
    };
    
    // Realizar ping inicial
    pingSession();
    
    // Configurar intervalo para pings periódicos
    const pingIntervalId = setInterval(pingSession, pingInterval);
    
    // Guardar ID del intervalo para limpieza
    window._sessionPingIntervalId = pingIntervalId;
    
    // Retornar función para detener pings
    return () => {
      if (window._sessionPingIntervalId) {
        clearInterval(window._sessionPingIntervalId);
        window._sessionPingIntervalId = null;
      }
    };
  };
  
  // Simulación de verificación de sesiones concurrentes (implementación real vendrá después)
  const checkConcurrentSessions = async (username, sessionToken) => {
    // Esta función será implementada completamente en el servicio de sesiones concurrentes
    return false;
  };
  
  // Exportar el proveedor
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      loading,
      login,
      logout,
      sessionTimeoutWarning,
      extendSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;