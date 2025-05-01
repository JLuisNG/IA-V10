// components/login/RoleRedirect.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente que redirecciona al usuario a su página principal basada en su rol
 * o a la ruta correspondiente a su rol
 */
const RoleRedirect = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // Obtener el rol base (para manejar roles compuestos como "PT - Administrator")
  const baseRole = currentUser.role.split(' - ')[0].toLowerCase();
  
  // Obtener la ruta actual sin el prefijo "/" inicial
  const currentPath = location.pathname.substring(1);
  
  // Si es una ruta específica (no solo /homePage), redirigir a la versión con prefijo de rol
  if (currentPath !== 'homePage' && currentPath !== 'home') {
    // Extraer la parte de la ruta después del primer "/"
    const pathSegments = currentPath.split('/');
    if (pathSegments.length > 1) {
      // Si ya incluye parámetros, preservarlos (como en /paciente/:patientId)
      return <Navigate to={`/${baseRole}/${pathSegments.slice(1).join('/')}`} replace />;
    } else {
      // Para rutas simples como /patients, /referrals, etc.
      return <Navigate to={`/${baseRole}/${currentPath}`} replace />;
    }
  }
  
  // Para /home o /homePage, redirigir a la página principal específica del rol
  return <Navigate to={`/${baseRole}/homePage`} replace />;
};

export default RoleRedirect;