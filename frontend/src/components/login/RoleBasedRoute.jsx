// components/login/RoleBasedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente para proteger rutas basadas en roles específicos
 * Si el usuario no tiene el rol requerido, redirecciona a su página principal
 * 
 * Roles con acceso especial:
 * - 'Developer' tiene acceso a todas las rutas
 * - 'Administrator' tiene acceso amplio a la mayoría de las rutas
 */
const RoleBasedRoute = ({ allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Si no está autenticado, esto no debería ocurrir porque ProtectedRoute
  // ya debería haberlo redirigido, pero por seguridad comprobamos de nuevo
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // Roles con acceso especial
  const specialRoles = ['Developer', 'Administrator'];
  
  // Verificar si el usuario tiene el rol adecuado o un rol especial
  const hasSpecialRole = specialRoles.some(role => 
    currentUser.role.includes(role)
  );
  
  // Si tiene un rol especial, permitir acceso a la ruta
  if (hasSpecialRole) {
    return <Outlet />;
  }
  
  // Para otros roles, verificar si están en la lista de roles permitidos
  if (!allowedRoles.includes(currentUser.role)) {
    // Obtener el rol base (para manejar roles compuestos como "PT - Administrator")
    const baseRole = currentUser.role.split(' - ')[0];
    
    // Redirigir a la ruta principal basada en su rol
    return <Navigate to={`/${baseRole.toLowerCase()}/homePage`} replace />;
  }
  
  // Si tiene permiso, permitir acceso a la ruta
  return <Outlet />;
};

export default RoleBasedRoute;