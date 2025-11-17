import React, { useState } from 'react';
import { db, auth } from '../firebaseConfig'; // Importez la BDD et l'auth
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Fonctions Firestore
import { useAuth } from '../context/AuthContext'; // Notre hook global !

function CreateDeal({ onDealPosted }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { currentUser } = useAuth(); // On récupère l'utilisateur connecté

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sécurité : Vérifier si l'utilisateur est bien connecté
    if (!currentUser) {
      setError("Vous devez être connecté pour poster un deal.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    console.log("Posting deal:", { title, description, price, link });

    try {
      // 1. Référence à la collection "deals"
      const dealsCollectionRef = collection(db, 'deals');

      // 2. Ajout du document
      await addDoc(dealsCollectionRef, {
        title: title,
        description: description,
        price: parseFloat(price) || 0, // Convertit en nombre
        link: link,
        createdAt: serverTimestamp(), // Heure du serveur (fiable)
        authorId: currentUser.uid,    // l'id de l'auteur du deal
        authorEmail: currentUser.email, // Pratique pour l'affichage
        // (On ajoutera les votes et commentaires plus tard)
        //likeCount: 0,
        //commentCount: 0,
      });

      // 3. Succès
      setSuccess("Bon plan posté avec succès !");
      setLoading(false);
      
      // 4. Vider le formulaire
      setTitle('');
      setDescription('');
      setPrice('');
      setLink('');

      // Attendre 1 seconde (pour lire le message) puis appeler la fonction pour fermer le modal.
      setTimeout(() => {
        onDealPosted(); 
      }, 1000); // 1 seconde

    } catch (err) {
      console.error(err);
      setError("Erreur lors de la publication. " + err.message);
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Titre du deal
          </label>
          <input 
            id="title" type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required placeholder="Ex: Gemini gratuit pendant 1 an"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
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
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
        
        {/* Affichage des messages */}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}

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