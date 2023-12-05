import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import es from 'date-fns/locale/es';
import en from 'date-fns/locale/en';

const dateLocale = { pt, es, en };

const formatDateLocale = (
  date,
  formatString,
  { locale } = { locale: 'en' },
  options = {},
) => {
  const newOptions = Object.assign({}, options, {
    locale: dateLocale[locale.toLowerCase()] || dateLocale.en,
  });

  return format(date, formatString, newOptions);
};

export default formatDateLocale;
