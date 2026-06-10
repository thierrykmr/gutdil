import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

function LoginModal({ isOpen, onClose, message }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/connexion');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-4">
        {/* Animated Icon */}
        <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-cyan-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-400/20 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
          Rejoignez la communauté !
        </h3>
        
        <p className="text-slate-600 mb-8 font-medium leading-relaxed max-w-sm mx-auto">
          {message || "Pour profiter pleinement de Gutdil (publier, voter, commenter ou voir les détails), connectez-vous ou créez un compte en quelques secondes."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
          >
            Plus tard
          </button>
          <button 
            onClick={handleLoginClick}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold hover:opacity-95 shadow-lg shadow-sky-500/20 transition-all active:scale-95"
          >
            Se connecter
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LoginModal;
