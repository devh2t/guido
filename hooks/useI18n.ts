
import { useState, useEffect, useCallback } from 'react';
import { getTranslation } from '../i18n/locales';

export const useI18n = (initialLang: string = 'en') => {
  const [language, setLanguage] = useState(initialLang);

  useEffect(() => {
    const isRtl = language === 'ar';
    // Update both dir and lang attributes on the root html element
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Manage specific font classes
    if (isRtl) {
      document.body.classList.add('font-arabic');
      document.body.style.fontFamily = "'IBM Plex Sans Arabic', system-ui, sans-serif";
    } else {
      document.body.classList.remove('font-arabic');
      document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
    }
  }, [language]);

  const t = useCallback((key: string) => {
    return getTranslation(language, key);
  }, [language]);

  return { language, setLanguage, t, isRtl: language === 'ar' };
};
