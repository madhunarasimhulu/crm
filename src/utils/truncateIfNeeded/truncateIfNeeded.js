const truncateIfNeeded = (str = '', maxLen = 20) =>
  str.length > maxLen ? `${str.substr(0, maxLen - 3)}...` : str;

export default truncateIfNeeded;
