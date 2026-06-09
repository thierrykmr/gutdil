import React from 'react';

function APropos() {
  return (
    <div className="max-w-3xl mx-auto p-8 text-slate-800">
      <div className="bg-white border border-sky-100 rounded-3xl p-6 md:p-10 shadow-xl mt-12">
        <h1 className="text-3xl font-black bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">À propos de Gutdil</h1>
        <p className="mt-6 text-slate-600 leading-relaxed font-medium">
          Gutdil est une application communautaire moderne dédiée au partage de bons plans, réductions, codes promos et astuces pour économiser au quotidien. Notre mission est de permettre à chacun de faire de bonnes affaires grâce à la force du collectif.
        </p>
      </div>
    </div>
  );
}
export default APropos;