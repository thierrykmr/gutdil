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
    <nav className="bg-white/80 backdrop-blur-md text-slate-800 border-b border-sky-100 shadow-sm sticky top-0 z-50 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Partie Gauche: Logo et Liens (Bureau) */}
          <div className="flex items-center space-x-6">
            <Link to="/home" className="text-2xl font-black bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
              Gutdil
            </Link>
            
            {/* NOUVEAU: Ces liens sont maintenant cachés sur mobile (hidden)
                et visibles sur bureau (md:flex) */}
            <div className="hidden md:flex space-x-2">
              <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all">
                Accueil
              </Link>
              <Link to="/home" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all">
                Bons Plans
              </Link>
              <Link to="/a-propos" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all">
                À Propos
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all">
                Contact
              </Link>
              {currentUser && (
                <Link to="/profil" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all">
                  Mon Profil
                </Link>
              )}
            </div>
          </div>

          {/* Partie Droite: Auth (Bureau) + Bouton Hamburger (Mobile) */}
          <div className="flex items-center">
            
            {/* Les boutons de connexion/déconnexion sont 
                maintenant cachés sur mobile (hidden) */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <Link to="/profil" className="text-sm text-slate-500 font-medium bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100/50 hover:bg-sky-100 hover:text-sky-600 transition-all">
                    {currentUser.displayName || currentUser.email}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md shadow-sky-500/10 hover:opacity-95 active:scale-95 transition-all"
                >
                  Connexion / Inscription
                </Link>
              )}
            </div>

            {/* Le bouton Hamburger (visible sur mobile: md:hidden) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Le menu mobile (s'affiche conditionnellement) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-md border-b border-sky-100 z-50 shadow-lg" id="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all"
              onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu au clic
            >
              Accueil
            </Link>
            <Link
              to="/home"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all"
              onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu au clic
            >
              Bons Plans
            </Link>
            <Link
              to="/a-propos"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all"
              onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu au clic
            >
              À Propos
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all"
              onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu au clic
            >
              Contact
            </Link>
            {currentUser && (
              <Link
                to="/profil"
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mon Profil
              </Link>
            )}
            
            {/* Séparateur pour les actions d'authentification */}
            <div className="border-t border-sky-100 pt-3 mt-2">
              {currentUser ? (
                <div className="px-3">
                  <Link 
                    to="/profil"
                    className="block text-sm text-slate-500 mb-2 font-medium hover:text-sky-600 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {currentUser.displayName || currentUser.email}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center block px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className="w-full text-center block px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500"
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