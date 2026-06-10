import React from 'react';
import { Outlet } from 'react-router-dom'; // Pour afficher les pages enfants
import Navbar from './components/Navbar';
import Alert from './components/Alert'; 
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoginModalOpen, loginModalMessage, closeLoginModal } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-50 via-white to-cyan-50 text-slate-800">
      {/* 1. La Navbar est toujours affichée */}
      <Navbar />
      < Alert />
      
      {/* 2. C'est ici que React Router chargera la page
             (Accueil, A Propos, Connexion...) */}
      <main>
        <Outlet />
      </main>
      {/* 3. Un footer simple */}
      <Footer />

      {/* Global Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        message={loginModalMessage} 
      />
    </div>
  );
}

export default App;