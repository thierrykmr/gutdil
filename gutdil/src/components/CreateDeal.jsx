import React, { useState } from 'react';
import { db, auth, storage } from '../firebaseConfig'; // Import de la BDD et du stockage
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DEAL_CATEGORIES } from '../constants/index';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { generateSearchIndex } from '../utils/searchHelper';
import { useDeals } from '../context/DealsContext'; // Import du contexte pour réinitialiser la liste des deals
import { analytics, logEvent } from '../firebaseConfig'; // Import de l'analytics et de la fonction logEvent

function CreateDeal({ onDealPosted }) {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');

  const [ imageFile, setImageFile ] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const { currentUser } = useAuth(); // On récupère l'utilisateur connecté
  const { setAlert } = useAlert(); // Pour afficher les alertes globales

  const { resetDeals } = useDeals(); // Import de la fonction pour réinitialiser la liste des deals 


  // Gérer la sélection du fichier
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      console.log("Fichier sélectionné:", e.target.files[0].name); 
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sécurité : Vérifier si l'utilisateur est bien connecté
    if (!currentUser) {
      setError("Vous devez être connecté pour poster un deal.");
      return;
    }

    if (!category) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    setLoading(true);
    setError('');

    let imageUrl = null;

    console.log("Posting deal:", { category, title, description, price, link });

    try {

      if (imageFile) {
        // Crée la référence dans Storage (ex: deals/USER_ID/nom_du_fichier_timestamp)
        const storageRef = ref(
          storage, 
          `deals/${currentUser.uid}/${imageFile.name}_${Date.now()}`
        );     
        await uploadBytes(storageRef, imageFile); // Upload le fichier
        imageUrl = await getDownloadURL(storageRef); // Récupère l'URL publique
      }

      // 1. Référence à la collection "deals"
      const dealsCollectionRef = collection(db, 'deals');

      // --- AJOUT DE L'INDEX DE RECHERCHE ---
      // On génère la liste des mots-clés à partir du titre et de la description
      const searchIndex = generateSearchIndex(title, description);

      // 2. Ajout du document
      await addDoc(dealsCollectionRef, {
        title: title,
        description: description,
        category: category,
        price: parseFloat(price) || 0, // Convertit en nombre
        link: link,
        imageUrl: imageUrl,
        searchIndex: searchIndex, // Stocke les mots-clés pour la recherche
        createdAt: serverTimestamp(),
        authorId: currentUser.uid, 
        authorEmail: currentUser.email,
        // (On ajoutera les votes et commentaires plus tard)
        //likeCount: 0,
        //commentCount: 0,
      });

      logEvent(analytics, 'create_deal', {
        category: category,
        title: title,
        has_image: !!imageUrl //pour savoir si les gens mettent les images ou pas
      });

      // 3. Succès
      setAlert("Bon plan posté avec succès !", "success");
      setLoading(false);
      
      // 4. Vider le formulaire
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
      setLink('');
      setImageFile(null);
      if (typeof resetDeals === 'function') resetDeals();

      // Attendre 1 seconde (pour lire le message) puis appeler la fonction pour fermer le modal.
      setTimeout(() => {
        onDealPosted(); 
      }, 1000); // 1 seconde

    } catch (err) {
      console.error(err);
      setAlert("Erreur lors de la publication. " + err.message, "error");
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-2xl font-black mb-6 text-slate-800 tracking-tight">
        Partager un bon plan
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="category" className="block text-sm font-bold text-slate-600 mb-1.5">
            Catégorie *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all"
          >
            <option value="" disabled>-- Choisir une catégorie --</option>
            {DEAL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-bold text-slate-600 mb-1.5">
            Titre du deal *
          </label>
          <input 
            id="title" type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required placeholder="Ex: Gemini gratuit pendant 1 an"
            className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-slate-600 mb-1.5">
            Description *
          </label>
          <textarea 
            id="description" value={description}
            onChange={(e) => setDescription(e.target.value)} 
            required
            rows="3" placeholder="Donnez plus de détails..."
            className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all resize-none"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-bold text-slate-600 mb-1.5">
            Image du deal (Optionnelle)
          </label>
          <input 
            id="image" type="file" accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-xl file:border-0 file:text-sm file:font-bold
                       file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 file:transition-all transition-all"
          />
          {imageFile && (
            <p className="text-xs text-sky-600 font-semibold mt-1">Fichier sélectionné : {imageFile.name}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-grow">
            <label htmlFor="link" className="block text-sm font-bold text-slate-600 mb-1.5">
              Lien vers le deal (Optionnel)
            </label>
            <input 
              id="link" type="url" value={link}
              onChange={(e) => setLink(e.target.value)} 
              optional='true' placeholder="https://..."
              className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all"
            />
          </div>
        </div>
        
        {/* Affichage des messages */}
        {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-95 transition-all shadow-md shadow-sky-500/10 active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? 'Publication...' : 'Poster le deal'}
        </button>
      </form>
    </>
  );
}

export default CreateDeal;