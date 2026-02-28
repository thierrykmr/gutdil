import React from 'react';
import { DEAL_CATEGORIES } from '../constants/index';

function FilterBar({ selectedCategory, onSelectCategory }) {
  return (
    /* Le conteneur parent doit être 'relative' pour positionner le dégradé */
    <div className="relative mb-8">
      
      {/* 1. L'effet de dégradé à droite 
          - 'pointer-events-none' est crucial pour pouvoir cliquer sur les boutons sous le dégradé.
          - 'from-gray-900' doit correspondre à la couleur de fond de ton App.jsx.
      */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
      {/* le degradé depend de w-20 et la couleur du degradé de from-gray-900 via-gray-900/80 to-transparent */}

      {/* 2. Le conteneur de scroll */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-3 pb-2 scrollbar-hide">
        {/* Bouton pour réinitialiser le filtre */}
        <button
          onClick={() => onSelectCategory('')}
          className={`inline-block px-5 py-2 rounded-full text-sm font-bold transition-all border
            ${selectedCategory === '' 
              ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}
        >
          Tous
        </button>

        {/* Affichage des catégories dynamiques */}
        {DEAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`inline-block px-5 py-2 rounded-full text-sm font-bold transition-all border
              ${selectedCategory === cat 
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}
          >
            {cat}
          </button>
        ))}
        
        {/* 3. Un petit espace vide à la fin pour que le dernier bouton ne soit pas collé au bord du dégradé */}
        <div className="min-w-[40px] h-1"></div>
      </div>
    </div>
  );
}

export default FilterBar;