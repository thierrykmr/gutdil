import React from 'react';
import Auth from './components/Auth';
import { useAuth } from './context/AuthContext'; // 1. Importer le Hook
import HomePage from './components/HomePage';
import './App.css';

function App() {
  // 2. Lire le "tableau d'affichage"
  const { currentUser } = useAuth(); 

  // 3. Le commutateur (logique d'affichage), cette page sera le commutateur de toute l'appli pour dire si un utilisateur est connecté ou pas
  return (
    <>
      {currentUser ? <HomePage /> : <Auth />}
    </>
  );
}

export default App;