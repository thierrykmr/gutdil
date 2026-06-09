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
            if (!currentUser) return;

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
            navigate(`/home`); // Rediriger vers la page de détail

        } catch (error) {
            console.error("Erreur de mise à jour:", error);
            setAlert("Erreur lors de la mise à jour du deal.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    // 3. AFFICHAGE (Le formulaire)
    if (loading || !deal) {
        return <p className="max-w-4xl mx-auto p-8 text-slate-700 font-medium">Chargement du bon plan pour modification...</p>;
    }

    return (
        <div className="max-w-lg mx-auto p-4 md:p-8 text-slate-800">
            <button 
                onClick={() => navigate(-1)} // Retour à la page précédente
                className="text-sky-600 hover:text-cyan-600 hover:underline mb-6 flex items-center gap-2 font-semibold transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Retour aux deals
            </button>
            <h1 className="text-2xl font-black mb-6 text-slate-800 tracking-tight">Modifier le deal : {deal.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-sky-100 shadow-xl">
                
                {/* Champ Catégorie (similaire à CreateDeal) */}
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-slate-600 mb-1.5">
                    Catégorie *
                  </label>
                  <div className="relative"> 
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all"
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
                    <label htmlFor="title" className="block text-sm font-bold text-slate-600 mb-1.5">Titre *</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                           className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all" />
                </div>
                
                {/* Champ Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-bold text-slate-600 mb-1.5">Description *</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required
                              className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all resize-none" />
                </div>

                {/* Champ Image (affichage de l'ancienne image) */}
                <div>
                    <label htmlFor="newImage" className="block text-sm font-bold text-slate-600 mb-1.5">Nouvelle Image (Optionnelle)</label>
                    {deal.imageUrl && !newImageFile && (
                        <p className="text-sm text-slate-500 mb-2 font-medium">Image actuelle : <img src={deal.imageUrl} alt="Deal" className="h-16 w-auto inline-block ml-2 rounded border border-sky-100 p-0.5 bg-sky-50/20" /></p>
                    )}
                    <input id="newImage" type="file" accept="image/*" onChange={handleImageChange} 
                           className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                             file:rounded-xl file:border-0 file:text-sm file:font-bold
                             file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition-all" />
                </div>

                {/* Champs Prix et Lien */}
                <div className="flex gap-4">
                    <div className="flex-grow">
                        <label htmlFor="link" className="block text-sm font-bold text-slate-600 mb-1.5">Lien vers le deal (Optionnel) </label>
                        <input id="link" type="url" value={link} onChange={(e) => setLink(e.target.value)}  
                               className="w-full p-3 rounded-xl bg-sky-50/40 border border-sky-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 transition-all" />
                    </div>
                </div>

                <button type="submit" disabled={submitting} 
                        className="w-full p-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:opacity-95 transition-all shadow-md shadow-sky-500/10 active:scale-95 disabled:opacity-50 mt-4">
                    {submitting ? 'Mise à jour...' : 'Mettre à jour le deal'}
                </button>
            </form>
        </div>
    );
}

export default EditDealPage;