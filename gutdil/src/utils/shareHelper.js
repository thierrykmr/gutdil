/**
 * Partage un bon plan en utilisant l'API Web Share native si disponible,
 * ou en copiant le lien dans le presse-papiers comme alternative.
 * 
 * @param {Object} deal Le bon plan à partager.
 * @param {Function} setAlert La fonction du contexte d'alerte pour afficher des toasts de confirmation.
 */
export const shareDeal = async (deal, setAlert) => {
  if (!deal) return;

  const shareData = {
    title: deal.title || "Bon plan Gutdil",
    text: deal.description || "Découvrez ce super bon plan sur Gutdil !",
    url: `${window.location.origin}/deals/${deal.id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      if (typeof setAlert === 'function') {
        setAlert("Lien du bon plan copié dans le presse-papiers !", "success");
      }
    }
  } catch (error) {
    // L'erreur 'AbortError' est déclenchée si l'utilisateur annule le partage (comportement normal).
    if (error.name !== 'AbortError') {
      console.error("Erreur de partage:", error);
      try {
        await navigator.clipboard.writeText(shareData.url);
        if (typeof setAlert === 'function') {
          setAlert("Lien du bon plan copié dans le presse-papiers !", "success");
        }
      } catch (clipError) {
        console.error("Erreur lors de la copie dans le presse-papiers:", clipError);
        if (typeof setAlert === 'function') {
          setAlert("Impossible de copier le lien.", "error");
        }
      }
    }
  }
};
