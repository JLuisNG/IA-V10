// services/ConcurrentSessionService.js

class ConcurrentSessionService {
    /**
     * Register a new session for a user
     * @param {string} username - The username
     * @param {string} sessionToken - Unique session token
     * @param {Object} metadata - Session metadata like device, browser, etc.
     * @returns {Promise<Object>} Registration result
     */
    static async registerSession(username, sessionToken, metadata = {}) {
      try {
        // En producción, esta lógica debería enviar una solicitud al backend
        // Por ahora, simulamos el almacenamiento en el localStorage
        
        // Obtener sesiones existentes
        const sessionData = this.getStoredSessions();
        
        // Preparar datos de la nueva sesión
        const newSession = {
          username,
          sessionToken,
          deviceInfo: metadata.deviceInfo || this.getDeviceInfo(),
          ipAddress: metadata.ipAddress || 'Unknown IP',
          startTime: Date.now(),
          lastActivity: Date.now(),
          active: true
        };
        
        // Verificar si existe una sesión activa para este usuario
        const existingSessions = sessionData.filter(
          session => session.username === username && session.active
        );
        
        // Si hay sesiones existentes, las marcamos como inactivas
        sessionData.forEach(session => {
          if (session.username === username && session.active) {
            session.active = false;
            session.endTime = Date.now();
            session.endReason = 'Logged in from another device';
          }
        });
        
        // Agregar la nueva sesión
        sessionData.push(newSession);
        
        // Guardar en localStorage
        localStorage.setItem('user_sessions', JSON.stringify(sessionData));
        
        return {
          success: true,
          isNewSession: true,
          previousSessions: existingSessions.length,
          sessionToken
        };
      } catch (error) {
        console.error('Error registering session:', error);
        return {
          success: false,
          error: 'Failed to register session'
        };
      }
    }
    
    /**
     * Check if there are concurrent sessions for a user
     * @param {string} username - The username
     * @param {string} currentSessionToken - Current session token
     * @returns {Promise<boolean>} True if concurrent sessions detected
     */
    static async checkConcurrentSessions(username, currentSessionToken) {
      try {
        // En producción, esta lógica debería hacer una solicitud al backend
        // Por ahora, simulamos la verificación en el localStorage
        
        // Obtener datos de sesión
        const sessionData = this.getStoredSessions();
        
        // Filtrar sesiones del usuario que no sean la actual y estén activas
        const concurrentSessions = sessionData.filter(
          session => 
            session.username === username && 
            session.sessionToken !== currentSessionToken && 
            session.active &&
            // Solo considerar sesiones registradas después de la sesión actual
            session.startTime > this.getCurrentSessionStartTime(sessionData, currentSessionToken)
        );
        
        return concurrentSessions.length > 0;
      } catch (error) {
        console.error('Error checking concurrent sessions:', error);
        return false;
      }
    }
    
    /**
     * Get current session start time
     * @param {Array} sessions - Array of sessions
     * @param {string} sessionToken - Current session token
     * @returns {number} Start time timestamp
     */
    static getCurrentSessionStartTime(sessions, sessionToken) {
      const currentSession = sessions.find(
        session => session.sessionToken === sessionToken
      );
      
      return currentSession ? currentSession.startTime : 0;
    }
    
    /**
     * Log out all sessions for a user except the current one
     * @param {string} username - The username
     * @param {string} currentSessionToken - Current session token to keep
     * @returns {Promise<Object>} Result of the operation
     */
    static async logoutOtherSessions(username, currentSessionToken) {
      try {
        // Obtener datos de sesión
        const sessionData = this.getStoredSessions();
        
        // Marcar otras sesiones como inactivas
        let loggedOutCount = 0;
        
        sessionData.forEach(session => {
          if (
            session.username === username && 
            session.sessionToken !== currentSessionToken && 
            session.active
          ) {
            session.active = false;
            session.endTime = Date.now();
            session.endReason = 'Logged out by user';
            loggedOutCount++;
          }
        });
        
        // Guardar datos actualizados
        localStorage.setItem('user_sessions', JSON.stringify(sessionData));
        
        return {
          success: true,
          loggedOutCount
        };
      } catch (error) {
        console.error('Error logging out other sessions:', error);
        return {
          success: false,
          error: 'Failed to log out other sessions'
        };
      }
    }
    
    /**
     * Update session activity timestamp
     * @param {string} sessionToken - Session token to update
     * @returns {Promise<boolean>} Success status
     */
    static async updateSessionActivity(sessionToken) {
      try {
        // Obtener datos de sesión
        const sessionData = this.getStoredSessions();
        
        // Encontrar y actualizar la sesión
        const sessionIndex = sessionData.findIndex(
          session => session.sessionToken === sessionToken
        );
        
        if (sessionIndex >= 0) {
          sessionData[sessionIndex].lastActivity = Date.now();
          
          // Guardar datos actualizados
          localStorage.setItem('user_sessions', JSON.stringify(sessionData));
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error updating session activity:', error);
        return false;
      }
    }/**
   * End the current session
   * @param {string} sessionToken - Session token to end
   * @param {string} reason - Reason for ending session
   * @returns {Promise<boolean>} Success status
   */
  static async endSession(sessionToken, reason = 'User logout') {
    try {
      // Obtener datos de sesión
      const sessionData = this.getStoredSessions();
      
      // Encontrar y actualizar la sesión
      const sessionIndex = sessionData.findIndex(
        session => session.sessionToken === sessionToken
      );
      
      if (sessionIndex >= 0) {
        sessionData[sessionIndex].active = false;
        sessionData[sessionIndex].endTime = Date.now();
        sessionData[sessionIndex].endReason = reason;
        
        // Guardar datos actualizados
        localStorage.setItem('user_sessions', JSON.stringify(sessionData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }
  
  /**
   * Get active sessions for a user
   * @param {string} username - The username
   * @returns {Promise<Array>} List of active sessions
   */
  static async getUserActiveSessions(username) {
    try {
      // Obtener datos de sesión
      const sessionData = this.getStoredSessions();
      
      // Filtrar sesiones activas del usuario
      const activeSessions = sessionData.filter(
        session => session.username === username && session.active
      );
      
      // Enmascarar información sensible
      return activeSessions.map(session => ({
        deviceInfo: session.deviceInfo,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
        isCurrentSession: session.sessionToken === localStorage.getItem('session_token')
      }));
    } catch (error) {
      console.error('Error getting user active sessions:', error);
      return [];
    }
  }
  
  /**
   * Get stored sessions from localStorage
   * @returns {Array} Array of session objects
   */
  static getStoredSessions() {
    try {
      const sessionData = localStorage.getItem('user_sessions');
      return sessionData ? JSON.parse(sessionData) : [];
    } catch (error) {
      console.error('Error getting stored sessions:', error);
      return [];
    }
  }
  
  /**
   * Get device info
   * @returns {Object} Device information
   */
  static getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceInfo = {
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Unknown'
    };
    
    // Detectar navegador
    if (userAgent.indexOf('Firefox') > -1) {
      deviceInfo.browser = 'Firefox';
    } else if (userAgent.indexOf('SamsungBrowser') > -1) {
      deviceInfo.browser = 'Samsung Internet';
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
      deviceInfo.browser = 'Opera';
    } else if (userAgent.indexOf('Trident') > -1) {
      deviceInfo.browser = 'Internet Explorer';
    } else if (userAgent.indexOf('Edge') > -1) {
      deviceInfo.browser = 'Edge';
    } else if (userAgent.indexOf('Chrome') > -1) {
      deviceInfo.browser = 'Chrome';
    } else if (userAgent.indexOf('Safari') > -1) {
      deviceInfo.browser = 'Safari';
    }
    
    // Detectar SO
    if (userAgent.indexOf('Windows') > -1) {
      deviceInfo.os = 'Windows';
    } else if (userAgent.indexOf('Mac') > -1) {
      deviceInfo.os = 'MacOS';
    } else if (userAgent.indexOf('Linux') > -1) {
      deviceInfo.os = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
      deviceInfo.os = 'Android';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
      deviceInfo.os = 'iOS';
    }
    
    // Detectar tipo de dispositivo
    if (userAgent.indexOf('Mobile') > -1 || userAgent.indexOf('Android') > -1 && userAgent.indexOf('Mobile') > -1) {
      deviceInfo.device = 'Mobile';
    } else if (userAgent.indexOf('iPad') > -1 || userAgent.indexOf('Tablet') > -1) {
      deviceInfo.device = 'Tablet';
    } else {
      deviceInfo.device = 'Desktop';
    }
    
    return deviceInfo;
  }
}

export default ConcurrentSessionService;