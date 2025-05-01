// components/session/SessionTimeoutContainer.jsx
import React from 'react';
import SessionTimeoutWarning from './SessionTimeoutWarning';
import { useAuth } from '../login/AuthContext';

const SessionTimeoutContainer = () => {
  const { sessionTimeoutWarning, extendSession, logout } = useAuth();
  
  return (
    <SessionTimeoutWarning
      isOpen={sessionTimeoutWarning.isOpen}
      remainingTime={sessionTimeoutWarning.remainingTime}
      onStayLoggedIn={extendSession}
      onLogout={logout}
    />
  );
};

export default SessionTimeoutContainer;