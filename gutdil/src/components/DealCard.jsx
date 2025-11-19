import React, { useState } from 'react';
import { DEFAULT_IMAGE_URL } from '../constants/index';

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
    const [imgFailed, setImgFailed] = useState(false);

    return (
        // La carte elle-même
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl">
            
            {/* Image: affiche l'image du deal ou le fallback DEFAULT_IMAGE_URL */}
                        <div className="h-40 bg-gray-700 overflow-hidden">
                            {imgFailed ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                    {/* Simple placeholder SVG */}
                                    <div className="text-center">
                                        <svg className="mx-auto mb-2" width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <rect width="64" height="40" rx="6" fill="#1f2937" />
                                            <path d="M8 28L24 14L40 28H8Z" fill="#374151"/>
                                            <circle cx="20" cy="14" r="4" fill="#4b5563" />
                                        </svg>
                                        <div className="text-gray-400 text-sm">Image indisponible</div>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={deal.imageUrl || DEFAULT_IMAGE_URL}
                                    alt={deal.title || 'Image du deal'}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        try {
                                            // Si ce n'est pas encore le fallback, remplacer par DEFAULT_IMAGE_URL
                                            if (e.target.src !== DEFAULT_IMAGE_URL) {
                                                e.target.src = DEFAULT_IMAGE_URL;
                                            } else {
                                                // Le fallback a aussi échoué -> basculer vers le placeholder React
                                                setImgFailed(true);
                                            }
                                        } catch (err) {
                                            setImgFailed(true);
                                        }
                                    }}
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
                    {deal.link ? (<a
                        href={deal.link}
                        target="_blank"
                        className="px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold text-sm hover:bg-cyan-600 transition-colors"
                    >
                        Voir le deal
                    </a>) : null}
                </div>
                
                {/* Espace pour les votes (futur) */}
                <div className="pt-2 text-sm text-gray-500">
                    👍 0 | 💬 0
                </div>

            </div>
        </div>
    );
}

export default DealCard;