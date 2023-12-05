import currencyCodes from './currencyCodes';

export default function getCurrencyCodeFromNumber(codeNumber) {
  if (isNaN(Number(codeNumber))) {
    return codeNumber;
  }

  const parsedCodeNumber = String(codeNumber);

  const currencies = currencyCodes.filter(
    (item) => item.number === parsedCodeNumber,
  );

  if (!currencies || currencies.length < 1) return '$';

  return currencies[0].code;
}
