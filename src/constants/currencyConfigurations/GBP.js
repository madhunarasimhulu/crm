const gbpConfig = {
  locale: 'en-GB',
  formats: {
    number: {
      GBP: {
        style: 'currency',
        currency: 'GBP',
        currencyDisplay: 'code',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

export default gbpConfig;
