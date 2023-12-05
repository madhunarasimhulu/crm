const formatCPF = (number) => {
  if (!number) {
    return '';
  }

  const sanitized = number.replace(/[^\d]+/g, '');

  if (!sanitized.length) {
    return '';
  }

  return `${sanitized}`.split('').reduce((a, b, i) => {
    if (i === 2 || i === 5) {
      b += '.';
    }

    if (i === 9) {
      a += '-';
    }

    return a + b;
  });
};

export default formatCPF;
