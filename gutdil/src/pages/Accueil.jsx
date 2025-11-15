import React from 'react';
import { Link } from 'react-router-dom';

function Accueil() {
  
  return (
    <div className="max-w-6xl mx-auto p-8 text-white text-center">
      <h1 className="text-5xl font-bold mb-4 mt-12">
        Bienvenue sur Gutdil
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Votre nouvelle communauté pour partager les meilleurs bons plans.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link 
          to="/connexion" 
          className="px-6 py-3 rounded-md bg-cyan-500 text-white font-semibold hover:bg-cyan-600 text-lg"
        >
          Commencer
        </Link>
        <Link 
          to="/a-propos" 
          className="px-6 py-3 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-600 text-lg"
        >
          En savoir plus
        </Link>
      </div>
      
      <div className="mt-24">
        <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
        <p className="text-gray-400">
          (Ici vous pouvez mettre du contenu statique, des images, etc.)
        </p>
      </div>
    </div>
  );
}

export default Accueil;