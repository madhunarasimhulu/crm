import * as configurations from '../../constants/currencyConfigurations';

const getCurrencyConfig = (currencyCode = 'USD') =>
  configurations[currencyCode.toUpperCase()] || configurations.USD;

export default getCurrencyConfig;
