import React, { useState } from 'react';
import { db, auth, storage } from '../firebaseConfig'; // Importez la BDD et l'auth
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DEAL_CATEGORIES } from '../constants/index';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

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

    console.log("Posting deal:", { title, description, price, link });

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

      // 2. Ajout du document
      await addDoc(dealsCollectionRef, {
        title: title,
        description: description,
        category: category,
        price: parseFloat(price) || 0, // Convertit en nombre
        link: link,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        authorId: currentUser.uid, 
        authorEmail: currentUser.email,
        // (On ajoutera les votes et commentaires plus tard)
        //likeCount: 0,
        //commentCount: 0,
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
      <h3 className="text-2xl font-bold mb-4 text-white">
        Partager un bon plan
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="" disabled>-- Choisir une catégorie --</option>
            {DEAL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Titre du deal
          </label>
          <input 
            id="title" type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required placeholder="Ex: Gemini gratuit pendant 1 an"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea 
            id="description" value={description}
            onChange={(e) => setDescription(e.target.value)} 
            rows="3" placeholder="Donnez plus de détails..."
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
            Image du deal (Optionnel)
          </label>
          <input 
            id="image" type="file" accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-violet-600 file:text-white hover:file:bg-violet-700"
          />
          {imageFile && (
            <p className="text-xs text-gray-400 mt-1">Fichier sélectionné : {imageFile.name}</p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Prix
            </label>
            <input 
              id="price" type="number" step="0.01" value={price}
              onChange={(e) => setPrice(e.target.value)} 
              optional='true' placeholder="100.00"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
              Lien
            </label>
            <input 
              id="link" type="url" value={link}
              onChange={(e) => setLink(e.target.value)} 
              optional='true' placeholder="https://..."
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
        
        {/* Affichage des messages */}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 rounded-md bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Publication...' : 'Poster le deal'}
        </button>
      </form>
    </>
  );
}

export default CreateDeal;