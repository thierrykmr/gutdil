import React, { createContext, useContext, useState } from 'react';

const DealsContext = createContext();

export const DealsProvider = ({ children }) => {
    const [deals, setDeals] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [loading, setLoading] = useState(false);
    //  AJOUT DE L'ÉTAT DE RECHERCHE
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Nouvel état pour forcer le rafraîchissement

    // Fonction pour réinitialiser si on change de catégorie
    const resetDeals = () => {
        setLoading(true);
        setDeals([]);
        setLastVisible(null);
        setHasMore(true);
        setRefreshTrigger(prev => prev + 1); // Incrémente pour forcer le useEffect à se réexécuter
    };

    return (
        <DealsContext.Provider value={{ 
            deals, setDeals,
            loading, setLoading, 
            lastVisible, setLastVisible, 
            hasMore, setHasMore,
            selectedCategory, setSelectedCategory,
            searchQuery, setSearchQuery,
            scrollPosition, setScrollPosition,
            refreshTrigger, setRefreshTrigger,
            resetDeals
        }}>
            {children}
        </DealsContext.Provider>
    );
};

export const useDeals = () => useContext(DealsContext);