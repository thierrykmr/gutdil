import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

function Profil() {
  const { currentUser } = useAuth();
  const { setAlert } = useAlert();

  const [loadingStats, setLoadingStats] = useState(true);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);

  const [stats, setStats] = useState({
    totalDeals: 0,
    totalLikes: 0,
    totalComments: 0,
    favoriteCategory: 'Aucune'
  });

  // Synchroniser le nom d'affichage au chargement de l'utilisateur
  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  // Récupérer les stats en temps réel sans tri (évite le besoin d'index composite)
  useEffect(() => {
    if (!currentUser) return;

    // Cette requête simple sur un seul champ ne nécessite aucun index
    const q = query(
      collection(db, 'deals'),
      where('authorId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dealsData = snapshot.docs.map((doc) => doc.data());
        
        // Calcul des statistiques
        const totalDeals = dealsData.length;
        const totalLikes = dealsData.reduce((sum, deal) => sum + (deal.likeCount || 0), 0);
        const totalComments = dealsData.reduce((sum, deal) => sum + (deal.commentCount || 0), 0);

        // Trouver la catégorie favorite
        let favoriteCategory = 'Aucune';
        if (totalDeals > 0) {
          const categoryCounts = {};
          dealsData.forEach((deal) => {
            if (deal.category) {
              categoryCounts[deal.category] = (categoryCounts[deal.category] || 0) + 1;
            }
          });

          let maxCount = 0;
          Object.entries(categoryCounts).forEach(([cat, count]) => {
            if (count > maxCount) {
              maxCount = count;
              favoriteCategory = cat;
            }
          });
        }

        setStats({
          totalDeals,
          totalLikes,
          totalComments,
          favoriteCategory
        });
        setLoadingStats(false);
      },
      (error) => {
        console.error("Erreur lors de la récupération des statistiques :", error);
        setAlert("Impossible de charger vos statistiques.", "error");
        setLoadingStats(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, setAlert]);

  // Formater la date d'inscription
  const getCreationDate = () => {
    if (currentUser?.metadata?.creationTime) {
      const date = new Date(currentUser.metadata.creationTime);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return "Date inconnue";
  };

  // Mettre à jour le nom d'affichage
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setAlert("Le nom d'affichage ne peut pas être vide.", "error");
      return;
    }

    try {
      setUpdatingName(true);
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });
      setAlert("Nom d'affichage mis à jour avec succès !", "success");
      setIsEditingName(false);
    } catch (err) {
      console.error("Erreur updateProfile:", err);
      setAlert("Erreur lors de la mise à jour du profil.", "error");
    } finally {
      setUpdatingName(false);
    }
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    const name = displayName || currentUser?.email || 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-slate-800 space-y-8 animate-fade-in mt-6">
      
      {/* 1. Carte Profil Utilisateur */}
      <section className="bg-white/80 backdrop-blur-md border border-sky-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-sky-100/10 relative overflow-hidden">
        {/* Cercles décoratifs d'arrière-plan */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-200/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        {/* Avatar avec initiales */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 via-cyan-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-md border-2 border-white">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profil" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>
        </div>

        {/* Détails profil */}
        <div className="flex-1 text-center md:text-left space-y-3 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
            {isEditingName ? (
              <form onSubmit={handleUpdateName} className="flex items-center gap-2 justify-center md:justify-start w-full max-w-xs mx-auto md:mx-0">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 text-lg w-full transition-all"
                  placeholder="Nom d'affichage"
                  disabled={updatingName}
                  maxLength={30}
                  required
                />
                <button
                  type="submit"
                  disabled={updatingName}
                  className="p-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 active:scale-95 shadow-sm"
                  aria-label="Enregistrer"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDisplayName(currentUser?.displayName || '');
                    setIsEditingName(false);
                  }}
                  disabled={updatingName}
                  className="p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-50 active:scale-95"
                  aria-label="Annuler"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {currentUser?.displayName || "Utilisateur sans nom"}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-sky-600 transition-colors p-1.5 rounded-lg hover:bg-sky-50"
                  aria-label="Modifier le nom d'affichage"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 justify-center md:justify-start text-sm text-slate-500 font-medium">
            <span className="flex items-center justify-center md:justify-start gap-1">
              📧 {currentUser?.email}
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span>
              Membre depuis le : <span className="text-slate-700 font-semibold">{getCreationDate()}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Grille de Statistiques */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-800 tracking-tight border-b border-sky-100 pb-2 flex items-center gap-2">
          📊 Mon activité
        </h3>
        
        {loadingStats ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Deals Postés */}
            <div className="bg-white/80 border border-sky-100 rounded-2xl p-5 hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Deals Partagés</span>
              <div className="flex items-baseline gap-1 h-10 mt-3">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{stats.totalDeals}</span>
                <span className="text-xs text-slate-500 font-semibold">deal{stats.totalDeals > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Card 2: Likes Reçus */}
            <div className="bg-white/80 border border-sky-100 rounded-2xl p-5 hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Likes Reçus</span>
              <div className="flex items-baseline gap-1 h-10 mt-3">
                <span className="text-4xl font-black text-rose-500 tracking-tight">❤️ {stats.totalLikes}</span>
              </div>
            </div>

            {/* Card 3: Commentaires Reçus */}
            <div className="bg-white/80 border border-sky-100 rounded-2xl p-5 hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Commentaires</span>
              <div className="flex items-baseline gap-1 h-10 mt-3">
                <span className="text-4xl font-black text-sky-600 tracking-tight">💬 {stats.totalComments}</span>
              </div>
            </div>

            {/* Card 4: Catégorie Favorite */}
            <div className="bg-white/80 border border-sky-100 rounded-2xl p-5 hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Thème Favori</span>
              <div className="flex items-center h-10 mt-3">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/10 to-cyan-500/10 text-sky-700 text-xs font-bold inline-block truncate max-w-full border border-sky-100">
                  {stats.favoriteCategory}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

export default Profil;
