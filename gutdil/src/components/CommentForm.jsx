import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, collection, addDoc, serverTimestamp, runTransaction, increment } from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

// Le formulaire a besoin du dealId pour savoir où poster le commentaire
function CommentForm({ dealId }) {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser, triggerLoginModal } = useAuth();
  const { setAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setAlert("Vous devez être connecté pour laisser un commentaire.", "error");
      return;
    }
    if (!commentText.trim()) {
      setAlert("Veuillez écrire un commentaire.", "error");
      return;
    }

    setLoading(true);
    
    // Références Firestore
    const commentsCollectionRef = collection(db, 'deals', dealId, 'comments');
    const dealDocRef = doc(db, 'deals', dealId);

    try {
      await runTransaction(db, async (transaction) => {
        // 1. CRÉER le commentaire dans la sous-collection (transaction.set ou addDoc)
        // Note: Nous utilisons addDoc ici pour laisser Firestore générer l'ID du commentaire (commentId)
        await addDoc(commentsCollectionRef, {
            text: commentText,
            authorId: currentUser.uid,
            authorEmail: currentUser.email,
            createdAt: serverTimestamp(),
        });

        // 2. METTRE À JOUR le compteur sur le document parent
        transaction.update(dealDocRef, { 
            commentCount: increment(1) // Utilisation de increment pour la robustesse
        });
      });

      // Succès
      setAlert("Commentaire posté avec succès !", "success");
      setCommentText('');
      setLoading(false);

    } catch (error) {
      console.error("Erreur de transaction de commentaire:", error);
      setAlert("Échec de la publication du commentaire.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-4 border-t border-sky-100 relative">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Laisser un commentaire</h3>
      
      {/* Affichage d'un message si l'utilisateur n'est pas connecté */}
      {!currentUser && (
        <p className="text-sm text-slate-500 mb-4">
          Connectez-vous pour participer à la discussion.
        </p>
      )}

      <div className="relative">
        {!currentUser && (
          <div 
            onClick={() => triggerLoginModal("Pour laisser un commentaire sur ce bon plan, vous devez être connecté.")}
            className="absolute inset-0 z-10 cursor-pointer rounded-xl"
            aria-label="Connectez-vous pour commenter"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={currentUser ? "Écrivez votre commentaire..." : "Connectez-vous pour écrire..."}
            rows="3"
            required
            disabled={loading || !currentUser}
            className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 disabled:opacity-50 transition-all resize-none"
          />
          <button
            type="submit"
            disabled={loading || !currentUser}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-95 transition-all shadow-md shadow-sky-500/10 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Publication...' : 'Commenter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentForm;