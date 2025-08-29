import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

const PrivateRoutes = ({ allowedRoles = [], children }) => {

  const { user } = useSelector(state => state.auth);

  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // obligar al usuario a cambiar su contraseña'

  // if (user?.user?.passwordChanged === false) {
  //   return <Navigate to="/change-password" replace state={{ from: location }} />;
  // }

  const userRole = user?.user?.role || ''; // Aseguramos que tenga algo
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    // Si no tiene permisos, redirige a página de "No autorizado"
    return (
      <Navigate to="/no-tiene-permisos" replace state={{ from: location }} />
    );
  }

  // Acceso permitido: renderiza el contenido
  return children ? children : <Outlet />;
};

export default PrivateRoutes;
