import React, { createContext, useContext, useState } from 'react';

const DealsContext = createContext();

export const DealsProvider = ({ children }) => {
    const [deals, setDeals] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);

    // Fonction pour réinitialiser si on change de catégorie
    const resetDeals = () => {
        setDeals([]);
        setLastVisible(null);
        setHasMore(true);
    };

    return (
        <DealsContext.Provider value={{ 
            deals, setDeals, 
            lastVisible, setLastVisible, 
            hasMore, setHasMore,
            selectedCategory, setSelectedCategory,
            scrollPosition, setScrollPosition,
            resetDeals
        }}>
            {children}
        </DealsContext.Provider>
    );
};

export const useDeals = () => useContext(DealsContext);