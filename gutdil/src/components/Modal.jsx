import React from 'react';

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

/**
 * Notre composant Modal générique.
 * @param {boolean} isOpen - Si le modal doit être visible.
 * @param {function} onClose - Ce qu'il faut faire pour le fermer.
 * @param {ReactNode} children - Le contenu à afficher *dans* le modal.
 */
function Modal({ isOpen, onClose, children }) {
  
  // Si le modal n'est pas "ouvert", on n'affiche rien du tout.
  if (!isOpen) {
    return null;
  }

  return (
    // 1. L'Overlay (le fond sombre)
    // On utilise 'fixed inset-0' pour qu'il couvre tout l'écran.
    // 'z-50' le met au-dessus de tout le reste.
    // 'onClick={onClose}' permet de fermer le modal en cliquant sur le fond.
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose} 
    >
      {/* 2. La "Carte" du Modal (le contenu blanc/gris) */}
      {/* 'onClick' ici empêche la fermeture si on clique dans le modal. */}
      <div
        className="relative w-full max-w-lg bg-gray-800 rounded-lg shadow-xl p-6"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* 3. Le bouton de fermeture 'X' */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
          aria-label="Fermer le modal"
        >
          <CloseIcon />
        </button>

        {/* 4. Le Contenu */}
        {/* C'est ici que notre formulaire de création sera injecté */}
        {children}
      </div>
    </div>
  );
}

export default Modal;