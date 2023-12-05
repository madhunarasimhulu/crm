/**
 * Retrieve current environment acronym from URL (e.g.: 'qa', 'dev')
 * @param {string} hostname - defaults to window.location.hostname
 */
const getCurrentEnv = (hostname = window.location.hostname) => {
  if (!hostname || /localhost/.test(hostname)) {
    return '-dev';
  }

  const matchFromURL = hostname.match(/(dev|qa|staging|prod|br|stable)/);
  const acronym = (matchFromURL && matchFromURL[0]) || 'dev';

  switch (acronym) {
    case 'dev':
    case 'qa':
    case 'staging':
      return `-${acronym}`;
    default:
      return '';
  }
};

export default getCurrentEnv;
