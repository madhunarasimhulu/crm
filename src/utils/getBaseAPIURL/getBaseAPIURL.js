/**
 * Retrieve current URL for Pismo APIs
 */
const getBaseAPIURL = () =>
  process.env.REACT_APP_API_URL || 'https://api-sandbox.pismolabs.io';

export default getBaseAPIURL;
