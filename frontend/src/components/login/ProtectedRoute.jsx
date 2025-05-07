import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, redirecciona al login
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Si estamos verificando la autenticación, mostrar un loading
  if (loading) {
    return <div className="auth-loading">Verificando autenticación...</div>;
  }

  // Si no está autenticado, redirigir al login y guardar la ruta a la que intentaba acceder
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado, permitir acceso a la ruta
  return <Outlet />;
};

export default ProtectedRoute;