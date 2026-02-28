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
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] 
                     px-6 py-3 rounded-lg shadow-2xl text-white font-bold 
                     min-w-[300px] text-center animate-bounce-in
                     ${alertTypeClass[alert.type] || 'bg-gray-700'}`}>
      <div className="flex items-center justify-center gap-2">
        <span>{alert.msg}</span>
      </div>
    </div>
  );
}

export default Alert;