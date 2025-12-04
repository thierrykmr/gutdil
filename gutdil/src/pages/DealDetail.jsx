import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';

import CommentList from '../components/CommonList';
import CommentForm from '../components/CommentForm';


function DealDetail() {
  // Récupère le paramètre dynamique de l'URL
  const { dealId } = useParams(); 

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ currentCommentCount, setCurrentCommentCount ] = useState(0);

  useEffect(() => {
      if (!currentUser) {
        navigate('/connexion');
      }
  }, [currentUser, navigate]);

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

  if (loading) {
    return <p className="max-w-6xl mx-auto p-8 text-white">Chargement des détails...</p>;
  }
  if (error) {
    return <p className="max-w-6xl mx-auto p-8 text-red-400">{error}</p>;
  }
  if (!deal) {
    return <p className="max-w-6xl mx-auto p-8 text-gray-400">Deal introuvable.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
      <button 
        onClick={() => navigate(-1)} // Retour à la page précédente
        className="text-cyan-400 hover:underline mb-4 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        Retour aux deals
      </button>

      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-4 text-cyan-400">{deal.title}</h1>
        
        {deal.imageUrl && (
          <img src={deal.imageUrl} alt={deal.title} className="w-full max-h-96 object-contain rounded-lg mb-6 bg-gray-700" />
        )}

        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
            <span className="text-4xl font-bold text-white">{deal.price} €</span>
            <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 font-semibold">
                {deal.category}
            </span>
        </div>

        <h2 className="text-xl font-bold mt-6 mb-2 text-gray-200">Description Complète</h2>
        <p className="text-gray-400 whitespace-pre-wrap">{deal.description}</p>
        
        <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center">
            <span className="text-sm text-gray-500">Posté par {deal.authorEmail}</span>
            { deal.link ? (<a
                href={deal.link}
                target="_blank"
                className="px-3 py-2 rounded-lg bg-violet-600 text-white font-bold text-lg hover:bg-violet-700 transition-colors"
            >
                Voir le deal
            </a>) : null }
        </div>
        { deal.commentCount > 0 ?
            (<div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center">
            
                <span className="text-sm text-gray-500">Veuillez scroller versla bas pour consulter les commentaires. </span>
            </div>) : null }

      </div>

      {/* Placeholder pour Commentaires / Votes */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        {/* NOUVELLE ZONE : Affichage du formulaire de commentaire */}
        <CommentForm dealId={deal.id} /> 
        
        {/* Liste des commentaires */}
        <div className="mt-8">
            {/* On utilise le vrai compteur du deal */}
            <h3 className="text-xl font-bold text-gray-200 mb-4">
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