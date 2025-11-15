import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// J'ai mis le SVG de Google dans un composant pour plus de propreté
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
  </svg>
);

function Auth() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const navigate = useNavigate(); // NOUVEAU: Hook de navigation
  const { currentUser } = useAuth(); // NOUVEAU: Lire le contexte

// Gardien de sécurité : Si l'utilisateur est DÉJÀ connecté, on le redirige vers /home
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/home'); // Redirection après succès
    } catch (err) {
      setError(`Erreur : ${err.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/home'); // Redirection après succès
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Erreur : " + err.message);
      }
    }
  };

  // N'afficher le formulaire que si l'utilisateur n'est pas encore chargé
  if (currentUser) {
    return null; // Ou un spinner de chargement
  }
  
  // --- AFFICHAGE TAILWIND ---
  // Notez les classes : ce sont des "classes utilitaires"
  // 'min-h-screen' = min-height: 100vh
  // 'flex' = display: flex
  // 'md:w-1/2' = sur les écrans "medium" (tablette) et plus, width: 50%
  // 'p-6' = padding: 1.5rem (24px)
  // 'mb-4' = margin-bottom: 1rem (16px)
  
  return (
    // Conteneur de la page (votre ancien .auth-page)
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      
      {/* La carte d'authentification (votre ancien .auth-card) */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
        
        {/* L'en-tête (votre .auth-brand) */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Gutdil</h1>
            <p className="text-sm text-gray-400">
              {isLogin ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte'}
            </p>
          </div>
        </div>

        {/* Formulaire Email */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input 
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required placeholder="votre@email.com"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Mot de passe
            </label>
            <input 
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required placeholder="••••••••"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md border border-red-800" role="alert">
              {error}
            </p>
          )}
          
          <button type="submit" className="w-full p-3 rounded-md bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold hover:opacity-90 transition-opacity">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        {/* Séparateur */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-2 text-xs font-semibold text-gray-500">OU</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Bouton Google */}
        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 p-3 rounded-md bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors border border-gray-600">
          <GoogleIcon />
          Continuer avec Google
        </button>

        {/* Bouton pour basculer */}
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300 underline text-center">
          {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

export default Auth;