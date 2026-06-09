import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 text-slate-800">
      <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500 tracking-tighter">
        404
      </h1>
      <h2 className="text-3xl font-bold text-slate-800 mt-4 mb-4">
        Oups ! Ce bon plan n'existe plus.
      </h2>
      <p className="text-slate-500 max-w-md mb-8 font-medium">
        La page que vous recherchez a peut-être été supprimée, a changé de nom ou est temporairement indisponible.
      </p>
      <Link
        to="/home"
        className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-95 shadow-md shadow-sky-500/10 transition-all active:scale-95 text-lg"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;