/**
 * Retrieve current URL for Pismo APIs
 */
const getUrlBaseOrgConfig = () =>
  process.env.REACT_APP_ORG_CONFIG_URL ||
  'https://presentation-admin.pismolabs.io';

export default getUrlBaseOrgConfig;
