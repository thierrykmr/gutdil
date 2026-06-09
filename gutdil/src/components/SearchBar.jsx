import React, { useState } from 'react';
import { useDeals } from '../context/DealsContext';

function SearchBar() {
  const { searchQuery, setSearchQuery, resetDeals } = useDeals();
  const [inputValue, setInputValue] = useState('');


  const handleSearch = (e) => {
    e.preventDefault();
    const term = inputValue.trim().toLowerCase();

    // Si l'utilisateur appuie sur Entrée avec le même mot, on ne fait rien
    if (term === searchQuery) return;

    resetDeals(); // Vide la liste actuelle pour la nouvelle recherche
    setSearchQuery(term);
  };

  const handleClear = () => {
    setInputValue('');
    resetDeals();
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full mb-8">
      <div className="relative group">
        {/* Icône Loupe */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-sky-400 group-focus-within:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Rechercher un bon plan, une information..."
          className="w-full bg-white/80 border border-sky-100 text-slate-800 placeholder-slate-400 pl-12 pr-12 py-4 rounded-2xl 
                     focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none 
                     transition-all text-lg backdrop-blur-sm shadow-lg shadow-sky-100/30"
        />

        {/* Bouton X pour effacer */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchBar;