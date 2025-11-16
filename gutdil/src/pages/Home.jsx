import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import  CreateDeal from '../components/CreateDeal';

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
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
      {/* Header (peut être dans la Navbar plus tard) */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {currentUser.email}
          </span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>
      
      <main>
        {/* 2. Placer le composant de création ici */}
        <CreateDeal />

        {/* 3. Zone pour la liste (étape suivante) */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">
            Les derniers Bons Plans
          </h2>
          <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
            (C'est ici que nous afficherons la liste des deals)
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;