import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore'; 

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { shareDeal } from '../utils/shareHelper';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';


function DealDetail() {
  const { currentUser, triggerLoginModal } = useAuth();
  // Récupère le paramètre dynamique de l'URL
  const { dealId } = useParams(); 

  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCommentCount, setCurrentCommentCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Écoute en temps réel les changements du document deal (pour le compteur)
useEffect(() => {
    // S'assurer que l'objet deal est présent avant de créer la référence Firestore
    if (!deal?.id) return; 

    // Référence au document deal parent
    const dealDocRef = doc(db, 'deals', deal.id); 

    // onSnapshot écoute ce document spécifiquement
    const unsubscribe = onSnapshot(dealDocRef, (snapshot) => {
        if (snapshot.exists()) {
            const updatedDealData = snapshot.data();

            // On lit la nouvelle valeur directement depuis le snapshot de Firestore
            setCurrentCommentCount(updatedDealData.commentCount || 0); 
            // ---------------------------------
        }
    });

    // Nettoyage : arrête d'écouter
    return () => unsubscribe();    
}, [deal]); // Dépend de l'objet deal (et donc de deal.id)
  
  // Écoute si le deal est favorisé par l'utilisateur connecté
  useEffect(() => {
    if (!currentUser || !dealId) {
      setIsFavorited(false);
      return;
    }
    const favDocRef = doc(db, 'users', currentUser.uid, 'favorites', dealId);
    const unsubscribe = onSnapshot(favDocRef, (snapshot) => {
      setIsFavorited(snapshot.exists());
    });
    return () => unsubscribe();
  }, [currentUser, dealId]);
  

  useEffect(() => {
    // Si l'ID du deal n'est pas là, on ne fait rien
    if (!dealId) return navigate('/'); 

    const fetchDeal = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const dealDocRef = doc(db, 'deals', dealId);
        const dealSnapshot = await getDoc(dealDocRef);

        if (dealSnapshot.exists()) {
          const data = dealSnapshot.data();
          setDeal({ id: dealSnapshot.id, ...data });
          setCurrentCommentCount(data.commentCount || 0); // synchro initiale
        } else {
          setError("Ce deal n'existe pas ou a été supprimé.");
        }
      } catch (err) {
        console.error("Erreur de chargement du deal:", err);
        setError("Erreur de connexion à la base de données.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [dealId, navigate]); // Rechargement si l'ID ou la navigation change

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      triggerLoginModal("Pour ajouter ce bon plan à vos favoris, vous devez être connecté.");
      return;
    }
    const favDocRef = doc(db, 'users', currentUser.uid, 'favorites', dealId);
    try {
      if (isFavorited) {
        await deleteDoc(favDocRef);
        setAlert("Retiré des favoris.", "success");
      } else {
        await setDoc(favDocRef, {
          dealId: dealId,
          addedAt: new Date()
        });
        setAlert("Ajouté aux favoris !", "success");
      }
    } catch (error) {
      console.error("Erreur mise à jour favoris:", error);
      setAlert("Une erreur est survenue lors de la mise à jour des favoris.", "error");
    }
  };

  if (loading) {
    return <p className="max-w-6xl mx-auto p-8 text-slate-700 font-medium">Chargement des détails...</p>;
  }
  if (error) {
    return <p className="max-w-6xl mx-auto p-8 text-red-500 font-bold">{error}</p>;
  }
  if (!deal) {
    return <p className="max-w-6xl mx-auto p-8 text-slate-500">Deal introuvable.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-slate-800">
      <button 
        onClick={() => navigate(-1)} // Retour à la page précédente
        className="text-sky-600 hover:text-cyan-600 hover:underline mb-6 flex items-center gap-2 font-semibold transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Retour aux deals
      </button>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-sky-100/80 shadow-xl">
        <h1 className="text-3xl font-black mb-4 bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent leading-tight">{deal.title}</h1>
        
        {deal.imageUrl && (
          <img src={deal.imageUrl} alt={deal.title} className="w-full max-h-96 object-contain rounded-xl mb-6 bg-sky-50/30 border border-sky-100/50 p-2" />
        )}

        <h2 className="text-xl font-bold mt-6 mb-2 text-slate-800">Description Complète</h2>
        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{deal.description}</p>
        
        <div className="mt-8 pt-4 border-t border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-sm text-slate-400 font-medium">Posté par {deal.authorEmail}</span>
            <div className="flex gap-3 w-full sm:w-auto">
                <button
                    onClick={handleFavoriteToggle}
                    className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl border border-sky-200 text-sky-600 font-semibold text-sm hover:bg-sky-50 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
                    aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={`w-4 h-4 overflow-visible ${isFavorited ? 'text-amber-500' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.39.77-.39.965 0l3.097 6.261a1 1 0 00.754.54l6.908.775c.429.048.6.577.29.882l-5.027 4.9c-.21.205-.306.495-.258.783l1.24 6.815c.078.43-.377.76-.756.529l-6.128-3.734a1 1 0 00-.968 0l-6.128 3.734c-.379.231-.834-.099-.756-.529l1.24-6.815a1 1 0 00-.258-.783l-5.027-4.9c-.31-.305-.139-.834.29-.882l6.908-.775a1 1 0 00.754-.54l3.097-6.261z" />
                    </svg>
                    <span>{isFavorited ? "Retirer des favoris" : "Favoris"}</span>
                </button>
                <button
                    onClick={() => shareDeal(deal, setAlert)}
                    className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl border border-sky-200 text-sky-600 font-semibold text-sm hover:bg-sky-50 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 00 2.25 2.25h9a2.25 2.25 0 00 2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
                    Partager
                </button>
                { deal.link ? (<a
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                        if (!currentUser) {
                            e.preventDefault();
                            triggerLoginModal("Pour accéder au lien de ce bon plan, vous devez être connecté.");
                        }
                    }}
                    className="flex-1 sm:flex-none justify-center text-center px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition-all shadow-md shadow-sky-500/10 active:scale-95 whitespace-nowrap"
                >
                    Voir le deal
                </a>) : null }
            </div>
        </div>
        { deal.commentCount > 0 ?
            (<div className="mt-8 pt-4 border-t border-sky-100 flex justify-between items-center">
            
                <span className="text-sm text-slate-400 italic">Veuillez scroller vers le bas pour consulter les commentaires. </span>
            </div>) : null }

      </div>

      {/* Commentaires */}
      <div className="mt-8 border-t border-sky-100 pt-4">
        {/* NOUVELLE ZONE : Affichage du formulaire de commentaire */}
        <CommentForm dealId={deal.id} /> 
        
        {/* Liste des commentaires */}
        <div className="mt-8">
            {/* On utilise le vrai compteur du deal */}
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {currentCommentCount} Commentaires
            </h3>
            
            {/* 2. INTÉGRATION DU COMPOSANT */}
            <CommentList dealId={deal.id} />
        </div>
      </div>

    </div>
  );
}

export default DealDetail;