import currency from 'currency.js';

const codeMap = {
  USD: {
    symbol: '',
    precision: 2,
    decimal: '.',
    separator: ',',
  },
  BRL: {
    symbol: 'R$',
    precision: 2,
    decimal: ',',
    separator: '.',
  },
  CAD: {
    symbol: 'CAD',
    precision: 2,
    decimal: '.',
    separator: ',',
  },
};

const formatCurrency = (value, code = 'USD') =>
  currency(value, codeMap[code] || codeMap.USD);

export default formatCurrency;
