/**
 * Génère un tableau de mots-clés uniques à partir d'un titre et d'une description
 * pour permettre la recherche plein texte sur Firestore.
 */

const STOP_WORDS = [
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'au', 'aux',
    'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or',
    'en', 'dans', 'avec', 'pour', 'sans', 'sous', 'sur', 'entre', 'par', 'pas', 'chez', 'vers', 'contre', 'depuis', 'pendant', 'après', 'avant', 'lors', 'puis',
    'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
    'me', 'te', 'se', 'lui', 'leur', 'moi', 'toi', 'soi', 'grâce', 'eux',
    'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
    'ce', 'cette', 'ces', 'cet',
    'qui', 'que', 'quoi', 'dont', 'où', 'quand', 'comment', 'pourquoi', 'lorsque', 'tandis', 'alors', 'ainsi', 'tant', 'tellement', 'tel', 'telle', 'tels', 'telles',
    'est', 'être', 'avoir', 'a', 'aux', 'ait', 'etant',
    'bien', 'tout', 'tous', 'toutes', 'autre', 'autres', 'même', 'mêmes',
    'votre', 'cette', 'si', 'lequel', 'laquelle', 'lesquels', 'lesquelles',
    'different', 'différente', 'différents', 'différentes', 'autre', 'autres',
    'plus', 'moins', 'assez', 'beaucoup', 'peu', 'très', 'trop',
    'ici', 'là', 'là-bas', 'partout', 'ailleurs',
    'oui', 'non', 'peut-être', 'certainement', 'jamais', 'toujours',
    'souvent', 'rarement', 'parfois', 'fréquemment', 'occasionnellement',
    'avant', 'après', 'aujourd\'hui', 'demain', 'hier',
    'matin', 'après-midi', 'soir', 'nuit',
    'année', 'mois', 'semaine', 'jour', 'heure', 'minute', 'seconde',
    'deal', 'deals', 'promo', 'promos', 'offre', 'offres'
    // Ajoutez d'autres stop words spécifiques à votre domaine si nécessaire
];

export const generateSearchIndex = (title = '', description = '') => {
  const fullText = `${title} ${description}`.toLowerCase();
  
  // Nettoie la ponctuation et découpe en mots
  const words = fullText
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ") // Remplace ponctuation par espace
    .split(/\s+/)                                // Découpe par n'importe quel espace
    .filter(word =>
           word.length > 2 &&           // Filtre les mots trop courts (le, la, de...)
           !STOP_WORDS.includes(word)   // Filtre les stop words
    );


  
  return [...new Set(words)]; // Supprime les doublons (Set)
};