const formatBirthdate = (str) => {
  if (!str) {
    return '';
  }

  const sanitized = str.replace(/[^\d]+/g, '');

  if (!sanitized.length) {
    return '';
  }

  return `${sanitized}`.split('').reduce((a, b, i) => {
    if (i === 1 || i === 3) {
      b += '/';
    }

    return a + b;
  });
};

export default formatBirthdate;
