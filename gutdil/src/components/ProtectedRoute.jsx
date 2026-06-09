import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirige vers la connexion
    return <Navigate to="/connexion" replace />;
  }

  // Affiche les routes enfants imbriquées
  return <Outlet />;
}

export default ProtectedRoute;
