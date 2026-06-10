import React, { useState, useEffect } from 'react';
import { DEFAULT_IMAGE_URL } from '../constants/index';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { doc, runTransaction, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Modal from './Modal';
import { shareDeal } from '../utils/shareHelper';

import { useDeals } from '../context/DealsContext'; // Import du contexte pour réinitialiser la liste des deals

import { analytics, logEvent } from '../firebaseConfig';

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

        const { resetDeals } = useDeals();

    const [hasLiked, setHasLiked] = useState(false); // Etat pour savoir si l'utilisateur a déjà liké

    const { setAlert } = useAlert();

    const [ currentLikeCount, setCurrentLikeCount ] = useState(0); // Etat du compteur des likes

    const [ currentCommentCount, setCurrentCommentCount ] = useState(0); // Etat du compteur des commentaires

    const [imgFailed, setImgFailed] = useState(false);

    const isOwner = currentUser && currentUser.uid === deal.authorId;

    const navigate = useNavigate();

    // État pour gérer l'ouverture du modal 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDealClick = () => {
        logEvent(analytics, 'view_deal', {
            deal_id: deal.id,
            deal_title: deal.title,
            category: deal.category
        });
    };

    useEffect(() => {
        if (!currentUser) return;

        // 1. Écoute si MOI j'ai liké ce deal
        const likeDocRef = doc(db, 'deals', deal.id, 'likes', currentUser.uid);
        const unsubscribeLike = onSnapshot(likeDocRef, (snapshot) => {
            setHasLiked(snapshot.exists());
        });

        // 2. Écoute le document du DEAL pour avoir le likeCount en temps réel
        const dealDocRef = doc(db, 'deals', deal.id);
        const unsubscribeDeal = onSnapshot(dealDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setCurrentLikeCount(data.likeCount || 0);
                setCurrentCommentCount(data.commentCount || 0);
            }
        });

        return () => {
            unsubscribeLike();
            unsubscribeDeal();
        };
    }, [currentUser, deal.id]); // Supprime deal.likeCount des dépendances

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

                // On récupère la valeur la plus fraîche depuis la DB dans la transaction
                const dbLikeCount = dealDoc.data().likeCount || 0;
                
                if (hasLiked) {
                    // UNLIKE: Diminuer le likeCount sur le deal et supprimer le doc like
                    transaction.update(dealDocRef, { likeCount: Math.max(dbLikeCount - 1, 0) });
                    transaction.delete(likeDocRef);
                } else {
                    // LIKE: Augmenter le likeCount sur le deal et créer le doc like
                    transaction.update(dealDocRef, { likeCount: dbLikeCount + 1 });
                    transaction.set(likeDocRef, { userId: currentUser.uid, createdAt: new Date() });
                }
            });
            // Le onSnapshot dans useEffect mettra à jour l'UI automatiquement.
        } catch (error) {
            console.error("Erreur de transaction de like:", error);
            setAlert(typeof error === 'string' ? error : "Erreur lors de l'interaction.", "error");
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

    const handleEditClick = (dealId) => {
        navigate(`/edit-deal/${dealId}`);
    };

    // La fonction qui exécute la suppression complète
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            // A. Suppression de l'image dans Storage si elle existe
            if (deal.imageUrl && !deal.imageUrl.includes('placehold.co')) {
                const imageRef = ref(storage, deal.imageUrl);
                await deleteObject(imageRef).catch(err => console.log("L'image n'existait déjà plus :", err));
            }

            // B. Suppression du document dans Firestore
            await deleteDoc(doc(db, 'deals', deal.id));
            
            setAlert("Le bon plan et son image ont été supprimés.", "success");
                if (typeof resetDeals === 'function') resetDeals(); // Réinitialise la liste des deals pour forcer le rechargement
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Erreur suppression:", error);
            setAlert("Erreur lors de la suppression.", "error");
        } finally {
            setIsDeleting(false);
    }
};

    return (
        <>
            <Link 
            to={`/deals/${deal.id}`} onClick={handleDealClick}
            className="block bg-white rounded-2xl border border-sky-100 shadow-md hover:shadow-xl hover:border-sky-200/80 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02] group relative"
            >
                {isOwner && (
                    <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                console.log("Modifier deal:", deal.id);
                                handleEditClick(deal.id); 
                            }}
                            className="p-2 rounded-full bg-white/95 text-sky-600 border border-sky-100 hover:text-cyan-600 shadow-md active:scale-95 transition-all"
                            aria-label="Modifier le deal"
                        >
                            {/* SVG d'un crayon/éditer */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                                <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button 
                            onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                setIsDeleteModalOpen(true); // On ne supprime pas encore, on demande confirmation
                            }}
                            className="p-2 rounded-full bg-white/95 text-red-500 border border-sky-100 hover:text-red-600 shadow-md active:scale-95 transition-all"
                            aria-label="Supprimer le deal"
                        >
                            {/* SVG de la corbeille */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>

                    </div>
                )}
                
                {/* Image: affiche l'image du deal ou le fallback DEFAULT_IMAGE_URL */}
                <div className="w-full aspect-[16/10] bg-sky-50/40 overflow-hidden relative border-b border-sky-50">
                    {imgFailed ? (
                        <div className="w-full h-full flex items-center justify-center bg-sky-50/50">
                            <div className="text-slate-400 text-sm font-medium">Image indisponible</div>
                        </div>
                    ) : (
                        <img
                            src={deal.imageUrl || DEFAULT_IMAGE_URL}
                            alt={deal.title || 'Image du deal'}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={handleImageError}
                        />
                    )}
                </div>

                <div className="p-5 space-y-3">
                                
                    {/* Catégorie et Date */}
                    <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-100/50">
                            {deal.category}
                        </span>
                        <span title={deal.authorEmail} className="font-medium">
                            Posté le {formatDate(deal.createdAt)}
                        </span>
                    </div>

                    {/* Titre et Description */}
                    <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-sky-600 transition-colors">
                        {deal.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                        {deal.description}
                    </p>
                    
                    {/* Espace pour les interactions (Likes & Commentaires) */}
                    <div className="pt-3 flex justify-start items-center space-x-4 border-t border-sky-100/60 mt-3">
                        
                        {/* Bouton de Like */}
                        <button 
                            onClick={handleLikeToggle}
                            className={`flex items-center text-sm font-bold transition-all px-2.5 py-1 rounded-lg hover:bg-red-50/50
                                ${hasLiked ? 'text-red-500 bg-red-50/30' : 'text-slate-400 hover:text-red-500'}
                            `}
                            aria-label={hasLiked ? "Ne plus aimer" : "Aimer ce deal"}
                        >
                            <span className="text-base mr-1">{hasLiked ? '❤️' : '👍'}</span>
                            {currentLikeCount}
                        </button>

                        {/* Bouton de Commentaire */}
                        <button 
                            onClick={(e) => {
                                console.log("Commentaire cliqué pour le deal:", deal.id);
                            }}
                            className="flex items-center text-sm font-bold text-slate-400 hover:text-sky-600 hover:bg-sky-50/50 px-2.5 py-1 rounded-lg transition-all"
                            aria-label="Voir les commentaires"
                        >
                            <span className="text-base mr-1">💬</span>
                            {currentCommentCount}
                        </button>

                        {/* Bouton de Partage */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                shareDeal(deal, setAlert);
                            }}
                            className="flex items-center text-sm font-bold text-slate-400 hover:text-sky-600 hover:bg-sky-50/50 px-2.5 py-1 rounded-lg transition-all"
                            aria-label="Partager ce deal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 00 2.25 2.25h9a2.25 2.25 0 00 2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                            </svg>
                            <span>Partager</span>
                        </button>

                    </div>

                </div>
            </Link>

        {/* MODAL DE CONFIRMATION - Taille réduite via max-w-sm */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="max-w-sm mx-auto text-center p-2">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Supprimer définitivement ?</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Voulez-vous vraiment supprimer <strong>{deal.title}</strong> ?
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? "..." : "Supprimer"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default DealCard;