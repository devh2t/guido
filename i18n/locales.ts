
import en from './en';
import ar from './ar';
import fr from './fr';
import es from './es';
import de from './de';
import pt from './pt';
import ja from './ja';
import ko from './ko';
import zh from './zh';
import hi from './hi';
import ru from './ru';
import tr from './tr';

// Define the shape of a translation file
type TranslationMap = Record<string, string>;

export const locales: Record<string, TranslationMap> = {
  en: en as TranslationMap,
  ar: ar as TranslationMap,
  fr: fr as TranslationMap,
  es: es as TranslationMap,
  de: de as TranslationMap,
  pt: pt as TranslationMap,
  ja: ja as TranslationMap,
  ko: ko as TranslationMap,
  zh: zh as TranslationMap,
  hi: hi as TranslationMap,
  ru: ru as TranslationMap,
  tr: tr as TranslationMap
};

export const getTranslation = (lang: string, key: string): string => {
  return locales[lang]?.[key] || locales['en']?.[key] || key;
};
