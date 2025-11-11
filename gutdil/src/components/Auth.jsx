// src/components/Auth.jsx

import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Importe notre config firebase
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import './Auth.css';

// Ceci est notre composant.
// C'est une fonction qui retourne du "HTML" (c'est du JSX).
function Auth() {
  
  // --- L'ÉTAT (State) ---
  // C'est le "cerveau" de notre composant.
  // "useState" est un "Hook" qui permet au composant de se souvenir de choses.
  
  // Se souvenir si on est en mode "Connexion" ou "Inscription"
  const [isLogin, setIsLogin] = useState(true); 
  
  // Se souvenir de ce qui est tapé dans les champs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Pour afficher les erreurs

  
  // --- LA LOGIQUE ---
  // Une fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche la page de se recharger
    setError(''); // Réinitialise l'erreur

    try {
      if (isLogin) {
        // Mode Connexion
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Utilisateur connecté !");
      } else {
        // Mode Inscription
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Utilisateur créé !");
      }
      // (Nous gérerons ce qu'il se passe *après* la connexion plus tard)
      
    } catch (err) {
      console.error(err.message);
      setError("Erreur : " + err.message); // Affiche l'erreur
    }
  };

  
  // --- L'AFFICHAGE (Render) ---
  // Ce que le composant doit afficher.
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo" aria-hidden="true">G</div>
          <div>
            <h1 className="auth-title">Gutdil</h1>
            <p className="auth-subtitle">{isLogin ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte'}</p>
          </div>
        </div>

        <h2 className="auth-heading">{isLogin ? 'Connexion' : 'Inscription'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} // Lie l'input à notre "état" email
              onChange={(e) => setEmail(e.target.value)} // Met à jour l'état à chaque frappe
              required 
              placeholder="votre@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input 
              id="password"
              type="password" 
              value={password} // Lie l'input à notre "état" password
              onChange={(e) => setPassword(e.target.value)} // Met à jour l'état
              required 
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="error-message" role="alert">{error}</p>}
          
          <button type="submit" className="btn-primary">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth" aria-pressed={!isLogin}>
          {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

// On exporte le composant pour pouvoir l'utiliser ailleurs
export default Auth;