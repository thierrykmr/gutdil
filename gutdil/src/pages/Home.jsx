import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDeals } from '../context/DealsContext'; // Import du contexte
import { useNavigate } from 'react-router-dom';
import { auth} from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';

import CreateDeal from '../components/CreateDeal';
import Modal from '../components/Modal';
import DealList from '../components/DealList';

function Home() { 
  const { currentUser } = useAuth();
  const { 
    selectedCategory, 
    setSelectedCategory,
    setSearchQuery, 
    scrollPosition, 
    setScrollPosition 
  } = useDeals(); // Utilisation du contexte global
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Restaurer la position du scroll dès que le composant est monté
  useLayoutEffect(() => {
    if (scrollPosition > 0) {
      // Un léger timeout permet de s'assurer que le contenu est rendu
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []); // [] car on ne veut le faire qu'au montage initial

  // 2. Sauvegarder la position du scroll en temps réel
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollPosition]);

  // Gardien de sécurité
  useEffect(() => {
    if (!currentUser) {
      navigate('/connexion');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
        
        {/* LA BARRE DE RECHERCHE EST TOUT EN HAUT */}
        <SearchBar />

        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Les derniers Bons Plans
          </h2>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20"
          >
            +
          </button>
        </header>
        
        <main>
          {/* La FilterBar utilise maintenant la catégorie du contexte */}
          <FilterBar 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
          
          <div>
            {/* DealList n'a plus besoin de prop, il puise dans le contexte */}
            <DealList />
          </div>
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <CreateDeal 
          onDealPosted={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
}

export default Home;