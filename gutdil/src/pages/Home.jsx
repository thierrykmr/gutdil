import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

function Home() { 
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Gardien de sécurité : Si personne n'est pas connecté, on redirige vers la page de connexion
  useEffect(() => {
    if (!currentUser) {
      navigate('/connexion');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    signOut(auth);
    // Le contexte mettra à jour currentUser, ce qui re-déclenchera
    // le useEffect ci-dessus et redirigera vers /connexion
  };

  // N'affiche rien tant qu'on ne sait pas si l'utilisateur est connecté
  if (!currentUser) {
    return null; // Ou un spinner
  }

  return (
    <div className="max-w-6xl mx-auto p-8 text-white">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            Bonjour, {currentUser.email}
          </span>
        </div>
      </header>
      
      <main>
        <h2 className="text-3xl font-bold mb-4">
          Liste des Bons Plans
        </h2>
        <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
          (Zone de contenu à venir pour les deals)
        </div>
      </main>
    </div>
  );
}

export default Home;