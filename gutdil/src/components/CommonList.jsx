// src/components/CommentList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// Fonction utilitaire pour formater la date (format court pour les commentaires)
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
};

function CommentList({ dealId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Référence à la sous-collection
    const commentsRef = collection(db, 'deals', dealId, 'comments');
    
    // 2. Requête : trier par date décroissante (plus récents en haut)
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    // 3. Écouteur temps réel
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dealId]);

  if (loading) return <p className="text-gray-500 text-sm mt-4">Chargement des discussions...</p>;

  if (comments.length === 0) {
    return <p className="text-gray-500 text-sm mt-4 italic">Aucun commentaire pour l'instant. Soyez le premier !</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-cyan-400 text-sm">
              {comment.authorEmail}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-200 text-sm whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;