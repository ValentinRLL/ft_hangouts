const localization = {
  fr: {
    contacts: 'Contacts',
    settings: 'Paramètres',
    darkmode: 'Mode sombre',
    language: 'Langue',
    error: 'Erreur',
    contactList: 'Liste de contacts',
    noContact: `Vous n'avez pas de contact`,
    addContact: 'Ajouter un contact',
    ok: 'OK',
    cancel: 'Annuler',
    french: 'Français',
    english: 'Anglais',
    favoriteColor: 'Couleur favorite',
    keypad: 'Clavier',
    phone: 'Téléphone',
    checkProfile: 'Voir le profil',
    writeAMessage: 'Écrire un message...',
    editProfile: 'Modifier le profil',
    conversationBegining: 'Début de la conversation',
    deleteContact: 'Supprimer le contact',
    deleteContactConfirm: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
    delete: 'Supprimer',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    notes: 'Notes',
    callCode: 'Indicatif',
    profile: 'Profil',
    chat: 'Discussion',
    edit: 'Modifier',
    addContactConditions: `Veuillez remplir au moins le prénom ou le nom ainsi qu'un numéro de téléphone`,
    appForeground: "L'application est revenue au premier plan !",
    timeSince: 'Temps ecoulé depuis : %VAR%',
  },
  en: {
    contacts: 'Contacts',
    settings: 'Settings',
    darkmode: 'Darkmode',
    language: 'Language',
    error: 'Error',
    contactList: 'Contact list',
    noContact: `You don't have any contact`,
    addContact: 'Add a contact',
    ok: 'OK',
    cancel: 'Cancel',
    french: 'French',
    english: 'English',
    favoriteColor: 'Favorite color',
    keypad: 'Keypad',
    phone: 'Phone',
    checkProfile: 'Check profile',
    writeAMessage: 'Write a message...',
    editProfile: 'Edit profile',
    conversationBegining: 'Start of the conversation',
    deleteContact: 'Delete contact',
    deleteContactConfirm: 'Are you sure you want to delete this contact?',
    delete: 'Delete',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    notes: 'Notes',
    callCode: 'Call code',
    profile: 'Profile',
    chat: 'Chat',
    edit: 'Edit',
    addContactConditions: `Please fill at least the first name or the last name and a phone number`,
    appForeground: 'App has come to the foreground!',
    timeSince: 'Time since: %VAR%',
  },
};

const getLocale = (lang, string, vars) => {
  try {
    let locale = localization[lang || 'fr'][string];
    let count = 0;
    locale = locale.replace(/%VAR%/g, () => (vars[count] !== null ? vars[count++] : '%VAR%'));
    return locale;
  } catch (error) {
    throw error;
  }
};

export default getLocale;
