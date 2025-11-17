import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

// Hook pour l'utiliser facilement
export function useAlert() {
  return useContext(AlertContext);
}

// Le fournisseur
export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ msg: '', type: '' });

  /**
   * Affiche une nouvelle alerte
   * @param {string} msg Le message
   * @param {string} type 'success' (vert) ou 'error' (rouge)
   */
  const showAlert = (msg, type) => {
    setAlert({ msg, type });

    // Masque l'alerte après 3 secondes
    setTimeout(() => {
      setAlert({ msg: '', type: '' });
    }, 3000);
  };

  const value = {
    alert,
    setAlert: showAlert // On expose la fonction sous le nom 'setAlert'
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}