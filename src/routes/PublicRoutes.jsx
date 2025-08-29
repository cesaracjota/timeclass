import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <Outlet />;
  }

  // Si el usuario no ha cambiado su contraseña, redirigir a change-password
  // if (user?.user?.passwordChanged === false) {
  //   return <Navigate to="/change-password" replace />;
  // }

  // Está logueado y ha cambiado su contraseña
  return <Navigate to="/" replace />;
};

export default PublicRoute;