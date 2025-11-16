// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { auth } from '../firebaseConfig';
// import { signOut } from 'firebase/auth';

// function Navbar() {
//   const { currentUser } = useAuth(); // Lit l'état global

//   const handleLogout = () => {
//     signOut(auth);
//   };

//   return (
//     <nav className="bg-gray-800 text-white shadow-md">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Partie Gauche: Logo et Liens */}
//           <div className="flex items-center space-x-6">
//             <Link to="/" className="text-xl font-bold text-cyan-400">
//               Gutdil
//             </Link>
//             <div className="hidden md:flex space-x-4">
//               <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//                 Accueil
//               </Link>
//               <Link to="/a-propos" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
//                 À Propos
//               </Link>
//             </div>
//           </div>

//           {/* Partie Droite: Auth */}
//           <div className="flex items-center">
//             {currentUser ? (
//               // Si connecté
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-gray-300 hidden md:block">
//                   {currentUser.email}
//                 </span>
//                 <button
//                   onClick={handleLogout}
//                   className="px-3 py-2 rounded-md text-sm font-medium bg-violet-600 hover:bg-violet-700"
//                 >
//                   Déconnexion
//                 </button>
//               </div>
//             ) : (
//               // Si déconnecté
//               <Link
//                 to="/connexion"
//                 className="px-3 py-2 rounded-md text-sm font-medium bg-cyan-500 hover:bg-cyan-600"
//               >
//                 Connexion / Inscription
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;






// Menu de navigation responsive avec menu hamburger

import React, { useState } from 'react'; // NOUVEAU: import useState
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

// Une icône "Hamburger" simple (SVG)
const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

// Une icône "Fermer" (X)
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);


function Navbar() {
  const { currentUser } = useAuth();
  
  // L'état pour gérer l'ouverture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    setIsMobileMenuOpen(false); // Ferme le menu en cas de déconnexion
  };

  return (
    // 'relative' est nécessaire pour positionner le menu mobile en dessous
    <nav className="bg-gray-800 text-white shadow-md relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Partie Gauche: Logo et Liens (Bureau) */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-cyan-400">
              Gutdil
            </Link>
            
            {/* NOUVEAU: Ces liens sont maintenant cachés sur mobile (hidden)
                et visibles sur bureau (md:flex) */}
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Accueil
              </Link>
              <Link to="/a-propos" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                À Propos
              </Link>
            </div>
          </div>

          {/* Partie Droite: Auth (Bureau) + Bouton Hamburger (Mobile) */}
          <div className="flex items-center">
            
            {/* NOUVEAU: Les boutons de connexion/déconnexion sont 
                maintenant cachés sur mobile (hidden) */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">
                    {currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-violet-600 hover:bg-violet-700"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-cyan-500 hover:bg-cyan-600"
                >
                  Connexion / Inscription
                </Link>
              )}
            </div>

            {/* NOUVEAU: Le bouton Hamburger (visible sur mobile: md:hidden) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOUVEAU: Le menu mobile (s'affiche conditionnellement) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-gray-800 z-10" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu au clic
            >
              Accueil
            </Link>
            <Link
              to="/a-propos"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu au clic
            >
              À Propos
            </Link>
            
            {/* Séparateur pour les actions d'authentification */}
            <div className="border-t border-gray-700 pt-3 mt-2">
              {currentUser ? (
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-400 mb-2">{currentUser.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-150 text-left block px-3 py-2 rounded-md text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className="w-auto text-center block px-3 py-2 rounded-md text-base font-medium bg-cyan-500 hover:bg-cyan-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion / Inscription
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;