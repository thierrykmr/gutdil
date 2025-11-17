import React from 'react';
import { useAlert } from '../context/AlertContext';

function Alert() {
  const { alert } = useAlert();

  // Si pas de message, ne rien afficher
  if (!alert.msg) {
    return null;
  }

  // Détermine la couleur de fond en fonction du type
  const alertTypeClass = {
    success: 'bg-green-600',
    error: 'bg-red-600'
  };

  return (
    // Ce 'div' sera notre bannière
    <div className={`p-4 w-full text-white text-center font-semibold ${alertTypeClass[alert.type] || 'bg-gray-700'}`}>
      {alert.msg}
    </div>
  );
}

export default Alert;