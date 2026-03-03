import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

function Contact() {
  const form = useRef();
  const { currentUser } = useAuth();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Gardien de sécurité : Redirection si non connecté
  useEffect(() => {
    if (!currentUser) {
      navigate('/connexion');
    }
  }, [currentUser, navigate]);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // On prépare les variables pour le template EmailJS
    // Note : {{email}} et {{title}} doivent être présents dans ton template en ligne
    const templateParams = {
      title: form.current.title.value,
      message: form.current.message.value,
      email: currentUser.email, // On utilise l'email de l'utilisateur connecté
      time: new Date().toLocaleString('fr-FR')
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setAlert("Votre message a été envoyé avec succès !", "success");
      form.current.reset();
    })
    .catch((err) => {
      console.error('Erreur EmailJS:', err);
      setAlert("Échec de l'envoi du message.", "error");
    })
    .finally(() => setLoading(false));
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
          Contactez nous
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Connecté en tant que : <span className="text-cyan-400">{currentUser.email}</span>
        </p>

        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Sujet du message</label>
            <input 
              type="text" 
              name="title" // Correspond au {{title}} du template
              required 
              placeholder="Quel est l'objet de votre demande ?"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Message</label>
            <textarea 
              name="message" // Correspond au {{message}} du template
              required 
              rows="5"
              placeholder="Décrivez votre problème ou suggestion..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Envoyer mon message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;