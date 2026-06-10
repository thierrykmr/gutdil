import React from 'react';
import { Link } from 'react-router-dom';

function Accueil() {
  
  return (
    <div className="max-w-6xl mx-auto p-8 text-slate-800 text-center">
      <h1 className="text-5xl md:text-6xl font-black mb-4 mt-16 bg-gradient-to-r from-sky-600 via-blue-650 to-cyan-500 bg-clip-text text-transparent tracking-tight leading-tight">
        Bienvenue sur Gutdil
      </h1>
      <p className="text-xl text-slate-600 mb-8 max-w-xl mx-auto font-medium">
        Votre nouvelle communauté pour partager les meilleurs bons plans.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link 
          to="/home" 
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-95 transition-all shadow-lg shadow-sky-500/20 text-lg active:scale-95"
        >
          Découvrir les Bons Plans
        </Link>
        <Link 
          to="/connexion" 
          className="px-8 py-3.5 rounded-xl bg-white text-slate-700 border border-sky-100 font-bold hover:bg-sky-50 transition-all shadow-sm text-lg active:scale-95"
        >
          Se connecter
        </Link>
      </div>
      
      <div className="mt-28 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-sky-100/50 max-w-3xl mx-auto shadow-xl shadow-sky-100/10">
        <h2 className="text-3xl font-black mb-4 text-slate-800 tracking-tight">Comment ça marche ?</h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Rejoignez des milliers de membres, partagez les meilleures offres trouvées sur internet et votez pour les bons plans les plus chauds du moment !
        </p>
      </div>
    </div>
  );
}

export default Accueil;