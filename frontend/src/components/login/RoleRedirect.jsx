// components/login/RoleRedirect.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RoleRedirect = () => {
  const location = useLocation();

  const storedUser = localStorage.getItem('auth_user');
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);
  const baseRole = user.role.split(' - ')[0].toLowerCase();

  const currentPath = location.pathname.substring(1); // Remove leading "/"
  const pathSegments = currentPath.split('/');

  // Handle redirection for subroutes like /patients or /paciente/:id
  if (currentPath !== 'homePage' && currentPath !== 'home') {
    if (pathSegments.length > 1) {
      return <Navigate to={`/${baseRole}/${pathSegments.slice(1).join('/')}`} replace />;
    } else {
      return <Navigate to={`/${baseRole}/${currentPath}`} replace />;
    }
  }

  // Default redirect to homePage
  return <Navigate to={`/${baseRole}/homePage`} replace />;
};

export default RoleRedirect;
