import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

function Navbar() {
  const { currentUser } = useAuth(); // Lit l'état global

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Partie Gauche: Logo et Liens */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-cyan-400">
              Gutdil
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Accueil
              </Link>
              <Link to="/a-propos" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                À Propos
              </Link>
            </div>
          </div>

          {/* Partie Droite: Auth */}
          <div className="flex items-center">
            {currentUser ? (
              // Si connecté
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 hidden md:block">
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
              // Si déconnecté
              <Link
                to="/connexion"
                className="px-3 py-2 rounded-md text-sm font-medium bg-cyan-500 hover:bg-cyan-600"
              >
                Connexion / Inscription
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;