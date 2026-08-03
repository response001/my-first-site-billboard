import { createContext, useContext, useEffect, useState } from 'react';
import { translations, languages } from './i18n';

const LanguageContext = createContext(null);

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    return languages.some((l) => l.code === saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = languages.find((l) => l.code === lang)?.rtl ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => {
    const value = getNested(translations[lang], key);
    return value !== undefined ? value : getNested(translations.en, key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
