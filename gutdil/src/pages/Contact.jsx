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
  // La page Contact est accessible à tous ; l'envoi nécessite une connexion.

  const sendEmail = (e) => {
    e.preventDefault();
    // Si l'utilisateur n'est pas connecté, on affiche une alerte et on redirige
    if (!currentUser) {
      setAlert('Veuillez vous connecter pour envoyer un message.', 'error');
      //navigate('/connexion');
      return;
    }
    setLoading(true);

    // On prépare les variables pour le template EmailJS
    // {{email}} et {{title}} doivent être présents dans ton template en ligne
    const formData = new FormData(form.current);
    const templateParams = {
      title: formData.get('title'),
      message: formData.get('message'),
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-sky-100">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
          Contactez-nous
        </h1>
        <p className="text-slate-500 mb-8 text-sm font-medium">
          {currentUser ? (
            <>Connecté en tant que : <span className="text-sky-600 font-bold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100/50 ml-1">{currentUser.email}</span></>
          ) : (
            <span className="text-slate-500">Vous devez vous connecter pour envoyer un message.</span>
          )}
        </p>

        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Sujet du message</label>
            <input 
              type="text" 
              name="title" // Correspond au {{title}} du template
              required 
              placeholder="Quel est l'objet de votre demande ?"
              className="w-full bg-sky-50/40 border border-sky-100 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Message</label>
            <textarea 
              name="message" // Correspond au {{message}} du template
              required 
              rows="5"
              placeholder="Décrivez votre problème ou suggestion..."
              className="w-full bg-sky-50/40 border border-sky-100 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-cyan-400/10 focus:border-cyan-400 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl font-bold text-white shadow-md shadow-sky-500/10 hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Envoyer mon message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;