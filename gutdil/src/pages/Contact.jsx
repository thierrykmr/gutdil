import React from 'react';

// import React, { useState } from 'react';
// import emailjs from '@emailjs/browser';
// import { useAlert } from '../context/AlertContext';

// function Contact() {
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { setAlert } = useAlert();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Paramètres à envoyer à EmailJS
//     const templateParams = {
//       subject: subject,
//       message: message,
//       reply_to: 'test@gmail.com', // L'adresse de destination
//     };

//     emailjs.send(
//       'VOTRE_SERVICE_ID', 
//       'VOTRE_TEMPLATE_ID', 
//       templateParams, 
//       'VOTRE_PUBLIC_KEY'
//     )
//     .then(() => {
//       setAlert("Message envoyé avec succès !", "success");
//       setSubject('');
//       setMessage('');
//     })
//     .catch((err) => {
//       console.error('Erreur:', err);
//       setAlert("Erreur lors de l'envoi du message.", "error");
//     })
//     .finally(() => setLoading(false));
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 md:p-12 text-white min-h-[70vh]">
//       <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
//         Contactez-nous
//       </h1>
//       <p className="text-gray-400 mb-8">
//         Une question ou une suggestion ? Notre équipe vous répondra dans les plus brefs délais.
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm">
//         <div>
//           <label className="block text-sm font-semibold text-gray-300 mb-2">Objet du message</label>
//           <input 
//             type="text" 
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             required
//             placeholder="Ex: Problème d'affichage, Partenariat..."
//             className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-300 mb-2">Votre message</label>
//           <textarea 
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//             rows="6"
//             placeholder="Dites-nous tout..."
//             className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading}
//           className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-bold text-white hover:opacity-90 transition-all transform active:scale-95 disabled:opacity-50"
//         >
//           {loading ? "Envoi en cours..." : "Envoyer le message"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Contact;

function Contact() {
    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12 text-white min-h-[70vh]">
            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Contactez-nous
            </h1>
            <p className="text-gray-400 mb-8">
                Une question ou une suggestion ? Notre équipe vous répondra dans les plus brefs délais.
            </p>

            <form className="space-y-6 bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm">
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Objet du message</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Problème d'affichage, Partenariat..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Votre message</label>
                    <textarea 
                        rows="6"
                        placeholder="Dites-nous tout..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-bold text-white hover:opacity-90 transition-all transform active:scale-95"
                >
                    Envoyer le message
                </button>
            </form>
        </div>
    );
}

export default Contact;