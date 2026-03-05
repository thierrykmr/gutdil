import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-600">
        404
      </h1>
      <h2 className="text-3xl font-bold text-white mt-4 mb-6">
        Oups ! Ce bon plan n'existe plus.
      </h2>
      <p className="text-gray-400 max-w-md mb-8">
        La page que vous recherchez a peut-être été supprimée, a changé de nom ou est temporairement indisponible.
      </p>
      <Link
        to="/home"
        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;