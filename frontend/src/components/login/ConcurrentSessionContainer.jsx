import React, { useState, useEffect } from 'react';
import ConcurrentSessionModal from './ConcurrentSessionModal';
import { useAuth } from '../login/AuthContext';
import ConcurrentSessionService from './ConcurrentSessionService';

const ConcurrentSessionContainer = () => {
  const { logout, currentUser } = useAuth();
  const [sessionState, setSessionState] = useState({
    isOpen: false,
    deviceInfo: null
  });
  
  // Función para manejar detección de sesión concurrente
  const handleConcurrentSession = (deviceInfo) => {
    setSessionState({
      isOpen: true,
      deviceInfo
    });
  };
  
  // Efecto para iniciar el monitoreo de sesiones concurrentes
  useEffect(() => {
    if (!currentUser) return;
    
    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken) return;
    
    // Referencia al intervalo para limpieza
    let checkInterval;
    
    // Función para verificar sesiones concurrentes
    const checkForConcurrentSessions = async () => {
      try {
        const isConcurrent = await ConcurrentSessionService.checkConcurrentSessions(
          currentUser.username,
          sessionToken
        );
        
        if (isConcurrent) {
          // Obtener información sobre la sesión más reciente
          const sessions = await ConcurrentSessionService.getUserActiveSessions(currentUser.username);
          const newerSession = sessions.find(s => !s.isCurrentSession);
          
          if (newerSession) {
            handleConcurrentSession(newerSession.deviceInfo);
            // Detener verificaciones una vez detectada una sesión concurrente
            clearInterval(checkInterval);
          }
        }
      } catch (error) {
        console.error('Error checking concurrent sessions:', error);
      }
    };
    
    // Verificar inmediatamente al cargar
    checkForConcurrentSessions();
    
    // Configurar verificación periódica
    checkInterval = setInterval(checkForConcurrentSessions, 30000); // Cada 30 segundos
    
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [currentUser]);
  
  // Función para mantener la sesión actual y cerrar las demás
  const handleStaySignedIn = async () => {
    if (!currentUser) return;
    
    try {
      const sessionToken = localStorage.getItem('session_token');
      
      // Registrar esta como la única sesión activa
      await ConcurrentSessionService.logoutOtherSessions(
        currentUser.username,
        sessionToken
      );
      
      // Cerrar modal
      setSessionState({
        isOpen: false,
        deviceInfo: null
      });
    } catch (error) {
      console.error('Error maintaining current session:', error);
      // En caso de error, cerrar sesión por seguridad
      logout();
    }
  };
  
  return (
    <ConcurrentSessionModal
      isOpen={sessionState.isOpen}
      deviceInfo={sessionState.deviceInfo}
      onStaySigned={handleStaySignedIn}
      onSignOut={logout}
    />
  );
};

export default ConcurrentSessionContainer;