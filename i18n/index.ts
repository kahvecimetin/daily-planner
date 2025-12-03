import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import tr from './translations/tr';
import en from './translations/en';

const i18n = new I18n({
  tr,
  en,
});

// Cihazın dilini al
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';

// Desteklenen diller
i18n.defaultLocale = 'en';
i18n.locale = deviceLocale === 'tr' ? 'tr' : 'en';
i18n.enableFallback = true;

export default i18n;
