import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import UsuariosPage from "../pages/UsuariosPage";
import RolesPage from "../pages/RolesPages";
import UserRolesPage from "../pages/UserRolesPage";
import UserPasswordsPage from "../components/UserPasswordsPage"; // ✅ Nueva importación
import AddressTable from "../components/AddressTable"; // ✅ Nueva importación
import PrivateRoute from "./PrivateRoute";
import DefaultLayout from "../Layout/DefaultLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas con layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        {/* Página principal */}
        <Route index element={<Dashboard />} />

        {/* Módulos protegidos */}
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="usuarios/:id/roles" element={<UserRolesPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="passwords" element={<UserPasswordsPage />} /> {/* ✅ Ruta agregada */}
        <Route path="/direcciones" element={<AddressTable />} />

        {/* Redirección por defecto si no coincide ninguna ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

