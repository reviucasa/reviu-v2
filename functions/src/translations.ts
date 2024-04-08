type TranslationContent = {
  subject: string;
  welcome: string;
  clickComment: string;
  signIn: string;
  copyComment: string;
};

type Translations = {
  [key: string]: TranslationContent;
};

const translations: Translations = {
  en: {
    subject: "Sign In to Reviucasa.com",
    welcome: "Welcome to Reviucasa.com!",
    clickComment: "Please click the link below to sign in to your account.",
    signIn: "Sign In",
    copyComment: `If you're on a mobile device, you can also copy the link 
    below and paste it into the browser of your choice.`,
  },
  es: {
    // Spanish translations
    subject: "Inicia sesión en Reviucasa.com",
    welcome: "¡Bienvenido a Reviucasa.com!",
    clickComment: `Por favor, haz clic en el enlace de abajo para iniciar 
    sesión en tu cuenta.`,
    signIn: "Iniciar Sesión",
    copyComment: `Si estás en un dispositivo móvil, también puedes copiar 
    el enlace de abajo y pegarlo en el navegador que prefieras.`,
  },
  ca: {
    // Catalan translations
    subject: "Inicia sessió a Reviucasa.com",
    welcome: "Benvingut a Reviucasa.com!",
    clickComment: `Si us plau, clica el següent enllaç per iniciar 
      sessió al teu compte.`,
    signIn: "Inicia Sessió",
    copyComment: `Si estàs en un dispositiu mòbil, també pots copiar 
    l'enllaç següent i enganxar-lo al navegador que prefereixis.`,
  },
};

export default translations;
