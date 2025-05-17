import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Obtén datos del usuario desde localStorage
const getStoredUser = () => {
  const userData = localStorage.getItem('auth_user');
  return userData ? JSON.parse(userData) : null;
};

const RoleBasedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const user = getStoredUser();

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const role = user.role;
  const baseRole = role.split(' - ')[0];

  const specialRoles = ['Developer', 'Administrator'];
  const hasAccess = allowedRoles.includes(role) || specialRoles.includes(baseRole);

  // Si el usuario tiene acceso, mostrar el contenido de la ruta
  if (hasAccess) {
    return <Outlet />;
  }

  // Si no tiene acceso, redirigir a su homePage
  return <Navigate to={`/${baseRole.toLowerCase()}/homePage`} replace />;
};

export default RoleBasedRoute;
