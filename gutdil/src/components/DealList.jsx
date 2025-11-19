import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'; 
import DealCard from './DealCard';

function DealList() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    
    // 1. Définir la requête Firestore : Nous récupérons tous les deals, triés par date de création décroissante
    const dealsQuery = query(
      collection(db, 'deals'),
      orderBy('createdAt', 'desc')
    );

    // 2. onSnapshot : Le listener temps réel: Il s'exécute une fois initialement, puis à chaque modification de la collection.
    const unsubscribe = onSnapshot(dealsQuery, 
      (snapshot) => {
        // Mappe les documents Firestore en objets JavaScript
        const dealsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDeals(dealsData);
        setLoading(false);
      }, 
      (err) => {
        // Gestion des erreurs (ex: problème de connexion)
        console.error("Erreur de chargement des deals:", err);
        setError("Échec du chargement des deals. Veuillez réessayer.");
        setLoading(false);
      }
    );

    // 3. Fonction de nettoyage
    // C'est crucial pour la performance : arrête d'écouter la base de données
    // lorsque le composant DealList quitte la page.
    return () => unsubscribe();
  }, []); // [] signifie que ce listener ne s'exécute qu'une seule fois.

  if (loading) {
    return <p className="text-gray-400 text-center py-8">Chargement des bons plans...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center py-8">{error}</p>;
  }

  if (deals.length === 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400 py-16">
        Aucun deal n'a encore été posté. Soyez le premier:) !
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {deals.map(deal => (
        // NOUVEAU: Utilisation du composant réutilisable DealCard
        <DealCard 
          key={deal.id} 
          deal={deal} 
        />
      ))}
    </div>
  );
}

export default DealList;