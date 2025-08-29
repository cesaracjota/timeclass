// AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import PublicRoute from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import LoginPage from "../pages/LoginPage";
import ChangePassword from "../components/auth/ChangePassword";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { routesConfig } from "./routesConfig";

export default function AppRouter() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Ruta de cambio de contraseña (accesible solo si está autenticado y no ha cambiado su contraseña) */}
      <Route 
        path="/change-password" 
        element={
          user ? (
            user?.user?.passwordChanged === false ? (
              <ChangePassword />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Rutas protegidas basadas en roles */}
      {routesConfig.map(({ path, element, roles }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoutes allowedRoles={roles}>
              {element}
            </PrivateRoutes>
          }
        />
      ))}

      {/* Acceso denegado y no encontrado */}
      <Route path="/no-tiene-permisos" element={<AccessDeniedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
