import React, { useState, useEffect } from 'react';
import { DEFAULT_IMAGE_URL } from '../constants/index';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { doc, runTransaction, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

// Fonction utilitaire simple pour formater la date
const formatDate = (timestamp) => {
    if (!timestamp) return "Date inconnue";
    // Si le timestamp est un objet Firestore (recommandé)
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};

function DealCard({ deal }) {
    const { currentUser } = useAuth();

    const [hasLiked, setHasLiked] = useState(false); // Etat pour savoir si l'utilisateur a déjà liké

    const [ currentLikeCount, setCurrentLikeCount ] = useState(0); // Etat du compteur des likes

    const [ currentCommentCount, setCurrentCommentCount ] = useState(0); // Etat du compteur des commentaires

    const [imgFailed, setImgFailed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
          if (!currentUser) {
            navigate('/connexion');
          }
      }, [currentUser, navigate]);

    useEffect(() => { 

        // Référence au document de like spécifique à cet utilisateur pour ce deal
        const likeDocRef = doc(db, 'deals', deal.id, 'likes', currentUser.uid);

        // Écoute en temps réel si le document de like existe
        const unsubscribe = onSnapshot(likeDocRef, (snapshot) => {
            setHasLiked(snapshot.exists());
        });

        // Met à jour le like ou comment count si le deal est mis à jour (pour le temps réel)
        setCurrentLikeCount(deal.likeCount || 0);
        setCurrentCommentCount(deal.commentCount || 0);

        return () => unsubscribe(); // Nettoyage
    }, [currentUser, deal.id, deal.likeCount]); // Dépend de l'utilisateur et du deal

    // 2. Gérer le basculement Like/Unlike (Transaction)
    const handleLikeToggle = async (e) => {
        console.log("Fonction HandleLikeToggle DÉMARRÉE");
        // Empêche la propagation du clic au Link parent
        e.stopPropagation(); 
        e.preventDefault();

        const likeDocRef = doc(db, 'deals', deal.id, 'likes', currentUser.uid);
        const dealDocRef = doc(db, 'deals', deal.id);

        try {
            await runTransaction(db, async (transaction) => {
                const dealDoc = await transaction.get(dealDocRef);
                
                if (!dealDoc.exists()) {
                    throw "Le deal n'existe pas ou a été supprimé.";
                }

                const newlikeCount = dealDoc.data().likeCount || 0;
                
                if (hasLiked) {
                    // UNLIKE: Diminuer le likeCount sur le deal et supprimer le doc like
                    transaction.update(dealDocRef, { likeCount: newlikeCount - 1 });
                    transaction.delete(likeDocRef);
                } else {
                    // LIKE: Augmenter le likeCount sur le deal et créer le doc like
                    transaction.update(dealDocRef, { likeCount: newlikeCount + 1 });
                    transaction.set(likeDocRef, { userId: currentUser.uid });
                }
            });
            // Le onSnapshot dans useEffect mettra à jour l'UI automatiquement.
        } catch (error) {
            console.error("Erreur de transaction de like:", error);
            alert("Une erreur est survenue lors du like.");
        }
    };

    const handleImageError = (e) => {
        // Si l'URL actuelle n'est pas déjà le DEFAULT_IMAGE_URL, on l'essaie
        if (e.target.src !== DEFAULT_IMAGE_URL) {
            e.target.src = DEFAULT_IMAGE_URL;
        } else {
            // Le fallback a échoué, on passe au placeholder React
            setImgFailed(true);
        }
    };

    return (
        <Link 
          to={`/deals/${deal.id}`} 
          className="block bg-gray-800 rounded-xl shadow-lg overflow-hidden transition duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl"
        >
            {/* Image: affiche l'image du deal ou le fallback DEFAULT_IMAGE_URL */}
            <div className="h-40 bg-gray-700 overflow-hidden">
                {imgFailed ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <div className="text-gray-400 text-sm">Image indisponible</div>
                    </div>
                ) : (
                    <img
                        src={deal.imageUrl || DEFAULT_IMAGE_URL}
                        alt={deal.title || 'Image du deal'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={handleImageError}
                    />
                )}
            </div>

            <div className="p-4 space-y-2">
                            
                {/* Catégorie et Date */}
                <div className="flex justify-between items-start text-xs text-gray-400">
                    <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 font-semibold">
                        {deal.category}
                    </span>
                    <span title={deal.authorEmail}>
                        Posté le {formatDate(deal.createdAt)}
                    </span>
                </div>

                {/* Titre et Description */}
                <h3 className="text-xl font-bold text-white leading-tight">
                    {deal.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                    {deal.description}
                </p>

                {/* Prix et Bouton de Lien */}
                <div className="flex justify-between items-end pt-2">
                    <span className="text-3xl font-extrabold text-cyan-400">
                        {deal.price} €
                    </span>
                    
                </div>
                
                {/* NOUVEAU: Espace pour les interactions (Likes & Commentaires) */}
                <div className="pt-2 flex justify-start items-center space-x-4 border-t border-gray-700 mt-2">
                    
                    {/* Bouton de Like */}
                    <button 
                        onClick={handleLikeToggle}
                        className={`flex items-center text-sm font-semibold transition-colors
                            ${hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
                        `}
                        aria-label={hasLiked ? "Ne plus aimer" : "Aimer ce deal"}
                    >
                        <span className="text-lg mr-1">{hasLiked ? '❤️' : '👍'}</span>
                        {currentLikeCount}
                    </button>

                    {/* Bouton de Commentaire (Exemple de futur bouton interactif) */}
                    <button 
                        onClick={(e) => {

                            console.log("Commentaire cliqué pour le deal:", deal.id);
                        }}
                        className="flex items-center text-sm text-gray-400 hover:text-cyan-500 transition-colors"
                        aria-label="Voir les commentaires"
                    >
                        <span className="text-lg mr-1">💬</span>
                        {currentCommentCount}
                    </button>

                </div>

            </div>
        
        </Link>
    );
}

export default DealCard;