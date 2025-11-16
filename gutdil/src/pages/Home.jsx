import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

import  CreateDeal from '../components/CreateDeal';
import Modal from '../components/Modal';

function Home() { 
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // NOUVEAU: Nous utilisons un Fragment <>...</> car le Modal
    // est un "frère" de la div principale, pas un "enfant".
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
        
        {/* Header (modifié) */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Les derniers Bons Plans
          </h2>
          
          {/* NOUVEAU: Le bouton "Ajouter" qui OUVRE le modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors"
          >
            +
          </button>
        </header>
        
        <main>
          {/* Le formulaire <CreateDeal /> n'est PLUS affiché ici */}
          
          <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
            (C'est ici que nous afficherons la liste des deals)
          </div>
        </main>
      </div>

      {/* NOUVEAU: Le Modal est ici, en bas du JSX */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        {/* Nous passons le formulaire <CreateDeal /> comme "enfant" */}
        <CreateDeal 
          // Nous ajoutons une "prop" pour que le formulaire
          // puisse dire au Modal de se fermer après succès.
          onDealPosted={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
}

export default Home;