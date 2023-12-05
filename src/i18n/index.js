import validateReactIntlDictKeys from './validateReactIntlDictKeys';

import en from './en';
import pt from './pt';
import es from './es';

if (!validateReactIntlDictKeys([en, pt, es])) {
  throw new Error('Confira as keys dos dicionarios de i18n.');
}

const i18n = {
  en,
  pt,
  es,
};

export default i18n;
