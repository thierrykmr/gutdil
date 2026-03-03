import React from 'react';
import { Outlet } from 'react-router-dom'; // Pour afficher les pages enfants
import Navbar from './components/Navbar';
import Alert from './components/Alert'; 
import Footer from './components/Footer';

function App() {

  return (
    <div className="min-h-screen bg-gray-900">
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
    </div>
  );
}

export default App;