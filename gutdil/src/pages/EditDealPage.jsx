import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // NOUVEAU: updateDoc
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { DEAL_CATEGORIES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

function EditDealPage() {
    const { dealId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { setAlert } = useAlert();

    const [deal, setDeal] = useState(null); // Deal original
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [link, setLink] = useState('');
    const [newImageFile, setNewImageFile] = useState(null); // Pour la nouvelle image
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. CHARGEMENT et PROTECTION
    useEffect(() => {
        const fetchAndCheckDeal = async () => {
            if (!currentUser) {
                navigate('/connexion');
                return;
            }

            const dealDocRef = doc(db, 'deals', dealId);
            const dealSnapshot = await getDoc(dealDocRef);

            if (!dealSnapshot.exists()) {
                setAlert("Deal introuvable.", "error");
                navigate('/home');
                return;
            }

            const dealData = dealSnapshot.data();

            // VÉRIFICATION CRITIQUE: Seul le propriétaire peut éditer
            if (currentUser.uid !== dealData.authorId) {
                setAlert("Vous n'êtes pas autorisé à modifier ce deal.");
                navigate(`/deals/${dealId}`);
                return;
            }

            // Prérélir les champs
            setDeal(dealData);
            setTitle(dealData.title || '');
            setDescription(dealData.description || '');
            setCategory(dealData.category || '');
            setPrice(dealData.price || '');
            setLink(dealData.link || '');
            setLoading(false);
        };
        fetchAndCheckDeal();
    }, [dealId, currentUser, navigate, setAlert]);

    // Gestion des inputs (similaire à CreateDeal.jsx)
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };

    // 2. MISE À JOUR DU DEAL
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!deal || submitting) return;

        setSubmitting(true);
        let imageUrl = deal.imageUrl; // Conserve l'ancienne URL par défaut

        try {
            // Upload de la nouvelle image si elle existe
            if (newImageFile) {
                const storageRef = ref(storage, `deals/${currentUser.uid}/${newImageFile.name}_${Date.now()}`);
                await uploadBytes(storageRef, newImageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Définir les champs qui ont changé
            const updatedFields = {
                title,
                description,
                category,
                price: parseFloat(price) || 0,
                link,
                imageUrl,
                updatedAt: new Date(), // Optionnel: Ajouter un champ de date de modification
            };

            const dealDocRef = doc(db, 'deals', dealId);
            await updateDoc(dealDocRef, updatedFields); // Mise à jour Firestore

            setAlert("Deal mis à jour avec succès !", "success");
            navigate(`/deals/${dealId}`); // Rediriger vers la page de détail

        } catch (error) {
            console.error("Erreur de mise à jour:", error);
            setAlert("Erreur lors de la mise à jour du deal.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    // 3. AFFICHAGE (Le formulaire)
    if (loading || !deal) {
        return <p className="max-w-4xl mx-auto p-8 text-white">Chargement du deal pour modification...</p>;
    }

    return (
        <div className="max-w-lg mx-auto p-4 md:p-8 text-white">
            <h1 className="text-xl font-bold mb-6">Modifier le deal: {deal.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-xl">
                
                {/* Champ Catégorie (similaire à CreateDeal) */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Catégorie
                  </label>
                  <div className="relative"> 
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      // Nous réutilisons le style qui gère l'apparence et la flèche
                      className="select-styled w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      style={{ paddingRight: '3rem' }} // Laisse de l'espace pour la flèche SVG
                    >
                      <option value="" disabled>-- Sélectionner une catégorie --</option>
                      {DEAL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Champ Titre */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                           className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                </div>
                
                {/* Champ Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" 
                              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                </div>

                {/* Champ Image (affichage de l'ancienne image) */}
                <div>
                    <label htmlFor="newImage" className="block text-sm font-medium text-gray-300 mb-1">Nouvelle Image (Optionnel)</label>
                    {deal.imageUrl && !newImageFile && (
                        <p className="text-sm text-gray-400 mb-2">Image actuelle : <img src={deal.imageUrl} alt="Deal" className="h-16 w-auto inline-block ml-2 rounded" /></p>
                    )}
                    <input id="newImage" type="file" accept="image/*" onChange={handleImageChange} 
                           className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0 file:text-sm file:font-semibold
                             file:bg-violet-600 file:text-white hover:file:bg-violet-700" />
                </div>

                {/* Champs Prix et Lien */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Prix</label>
                        <input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                               className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                    </div>
                    <div className="flex-grow">
                        <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">Lien</label>
                        <input id="link" type="url" value={link} onChange={(e) => setLink(e.target.value)}  
                               className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-cyan-500" />
                    </div>
                </div>

                <button type="submit" disabled={submitting} 
                        className="w-full p-3 rounded-md bg-cyan-600 text-white font-bold hover:bg-cyan-700 disabled:opacity-50">
                    {submitting ? 'Mise à jour...' : 'Mettre à jour le deal'}
                </button>
            </form>
        </div>
    );
}

export default EditDealPage;