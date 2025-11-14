import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebaseConfig'; // Notre config firebase
import { onAuthStateChanged } from 'firebase/auth';

// 1. Créer le Context
const AuthContext = createContext();

// 2. Créer un "Hook" personnalisé pour utiliser ce contexte facilement
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Créer le composant "Fournisseur" (Provider)
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Pour savoir si on charge

  useEffect(() => {
    // onAuthStateChanged est un "espion" de Firebase
    // Il se déclenche à chaque connexion/déconnexion/rafraîchissement
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // On a fini de charger
    });

    // Nettoyer l'espion quand le composant est "démonté"
    return unsubscribe;
  }, []); // Le tableau vide [] signifie "ne lance ceci qu'une seule fois"

  // Les "valeurs" que nous partageons avec toute l'application
  const value = {
    currentUser
  };

  // On affiche les "enfants" (le reste de l'app)
  // seulement quand on a fini de charger.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}