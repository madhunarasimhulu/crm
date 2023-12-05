const formatCNPJ = (number) => {
  if (!number) return '';

  const sanitized = number.replace(/[^\d]+/g, '');
  if (!sanitized.length) return '';

  return String(number).replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5',
  );
};

export default formatCNPJ;
