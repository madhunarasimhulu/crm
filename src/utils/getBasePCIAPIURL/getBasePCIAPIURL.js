/**
 * Retrieve current URL for Pismo PCI API
 */
const getBasePCIAPIURL = () =>
  process.env.REACT_APP_PCI_API_URL || 'https://api-sandbox.pismolabs.io';

export default getBasePCIAPIURL;
