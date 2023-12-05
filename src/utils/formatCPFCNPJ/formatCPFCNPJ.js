const formatCPFCNPJ = (number) => {
  if (!number) return '';

  const sanitized = number.replace(/[^\d]+/g, '');

  if (!sanitized.length) return '';

  if (number.length <= 11) {
    // CPF
    return `${sanitized}`.split('').reduce((a, b, i) => {
      if (i === 2 || i === 5) {
        b += '.';
      }

      if (i === 9) {
        a += '-';
      }

      return a + b;
    });
  }
  // CNPJ
  return String(number).replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5',
  );
};

export default formatCPFCNPJ;
