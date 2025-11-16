import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { auth } from '../firebaseConfig'; // Notre config firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';


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

  // Référence pour stocker l'ID du minuteur
  const inactivityTimerRef = useRef(null);

  // NOUVEAU: Fonction de déconnexion
  const logout = () => {
    console.log("Inactivité détectée. Déconnexion...");
    signOut(auth);
  };

  // Fonction pour réinitialiser le minuteur
  const resetInactivityTimer = () => {
    // Annule le minuteur précédent
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Lance un nouveau minuteur de 5 minutes
    inactivityTimerRef.current = setTimeout(logout,  5* 60 * 1000);
  };

  useEffect(() => {
    // onAuthStateChanged est un "espion" de Firebase. Il se déclenche à chaque connexion/déconnexion/rafraîchissement
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // On a fini de charger
    });

    // Nettoyer l'espion quand le composant est "démonté"
    return unsubscribe;
  }, []); // Le tableau vide [] signifie "ne lance ceci qu'une seule fois"


  // useEffect pour gérer l'inactivité
  useEffect(() => {
    // Ce hook ne fait rien si l'utilisateur n'est pas connecté
    if (currentUser) {
      // Liste des événements d'activité
      const events = [
        'mousemove',
        'mousedown',
        'keydown',
        'touchstart',
        'scroll'
      ];

      // Quand une activité est détectée, on réinitialise le minuteur
      const handleActivity = () => {
        resetInactivityTimer();
      };
      // Ajoute les écouteurs d'événements
      events.forEach(event => window.addEventListener(event, handleActivity));

      // Lance le minuteur pour la première fois
      resetInactivityTimer();

      // Fonction de "nettoyage"
      // S'exécute quand le composant est "démonté" ou quand l'utilisateur se déconnecte
      return () => {
        events.forEach(event => window.removeEventListener(event, handleActivity));
        // Annule le minuteur en cours
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [currentUser]); 


  // Les "valeurs" que nous partageons avec toute l'application
  const value = {
    currentUser
  };

  // On affiche les "enfants" (le reste de l'app) seulement quand on a fini de charger
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}