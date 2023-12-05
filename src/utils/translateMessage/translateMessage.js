function translateMessage(intl, id, values = {}) {
  return intl.formatMessage({ id }, values);
}

export default translateMessage;
