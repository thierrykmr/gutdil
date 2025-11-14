import React from 'react';
import { useAuth } from '../context/AuthContext'; // On ré-utilise le Hook !
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

function HomePage() {
  // On récupère l'utilisateur actuel depuis notre "tableau d'affichage"
  const { currentUser } = useAuth();

  const handleLogout = () => {
    signOut(auth);
    // L'espion (onAuthStateChanged) dans AuthContext va voir
    // la déconnexion et App.jsx va re-basculer tout seul.
  };

  return (
    <div className="min-h-screen bg-white-900 text-blue p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue">Gutdil</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Bonjour, {currentUser.email}
          </span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-violet-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>
      
      <main>
        <h2 className="text-3xl font-bold mb-4">
          Liste des Bons Plans
        </h2>
        {/* C'est ici que nous afficherons les deals plus tard */}
        <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
          (Zone de contenu à venir)
        </div>
      </main>
    </div>
  );
}

export default HomePage;