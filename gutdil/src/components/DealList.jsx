import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore'; 
import DealCard from './DealCard';
import { useDeals } from '../context/DealsContext'; // Import du contexte

function DealList() {
  // On récupère tout du contexte global
  const { 
    deals, setDeals, 
    lastVisible, setLastVisible, 
    hasMore, setHasMore,
    selectedCategory 
  } = useDeals();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const DEALS_PER_PAGE = 9; 

  const fetchDeals = async (isNextPage = false) => {
    try {
      if (isNextPage) setLoadingMore(true);
      else {
        setLoading(true);
        // On ne vide pas forcément ici, le useEffect s'en charge si la catégorie change
      }
      
      setError(null);

      let dealsQuery = query(
        collection(db, 'deals'),
        orderBy('createdAt', 'desc'),
        limit(DEALS_PER_PAGE)
      );

      if (selectedCategory) {
        dealsQuery = query(dealsQuery, where('category', '==', selectedCategory));
      }

      if (isNextPage && lastVisible) {
        dealsQuery = query(dealsQuery, startAfter(lastVisible));
      }

      const snapshot = await getDocs(dealsQuery);

      if (snapshot.empty) {
        if (!isNextPage) setDeals([]);
        setHasMore(false);
      } else {
        const dealsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDeals(prev => isNextPage ? [...prev, ...dealsData] : dealsData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === DEALS_PER_PAGE);
      }
    } catch (err) {
      console.error("Erreur de chargement des deals:", err);
      setError("Échec du chargement des deals.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Logique de chargement intelligente
  useEffect(() => {
    // Si on change de catégorie, on doit réinitialiser et charger
    // Ou si c'est le tout premier chargement (deals vides)
    const shouldReset = deals.length > 0 && deals[0].category !== selectedCategory && selectedCategory !== '';
    
    if (deals.length === 0 || shouldReset) {
      setLastVisible(null);
      fetchDeals(false);
    }
    // Si deals.length > 0 et qu'on revient d'une page détail, 
    // l'useEffect ne fait rien, préservant la liste et le scroll.
  }, [selectedCategory]);

  if (loading && deals.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error && <p className="text-red-400 text-center py-4">{error}</p>}
      
      {deals.length === 0 && !loading ? (
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-xl text-center text-gray-400 py-16">
          Aucun deal trouvé.
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pb-20">
              <button
                onClick={() => fetchDeals(true)}
                disabled={loadingMore}
                className="group relative px-8 py-3 bg-gray-800 border border-gray-700 text-cyan-400 font-bold rounded-xl 
                           hover:bg-gray-700 hover:border-cyan-500/50 transition-all active:scale-95
                           disabled:opacity-50 flex items-center gap-3 overflow-hidden shadow-xl"
              >
                {loadingMore ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>Voir plus de bons plans</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && deals.length > 0 && (
            <div className="flex flex-col items-center gap-2 pb-20">
              <div className="w-10 h-px bg-gray-700"></div>
              <p className="text-gray-500 text-sm italic">C'est tout pour le moment !</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DealList;