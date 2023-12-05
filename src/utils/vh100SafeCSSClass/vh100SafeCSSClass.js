const vh100SafeCSSClass = () =>
  window.location.search.match(/\?utm_source=homescreen/) ||
  (window.navigator && /\w*like\w*/.test(window.navigator.userAgent))
    ? 'vh-100-safe-homescreen'
    : 'vh-100-safe';

export default vh100SafeCSSClass;
