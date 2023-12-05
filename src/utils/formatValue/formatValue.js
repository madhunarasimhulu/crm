import { formatCurrency } from '../index';

const formatValue = (value, code) =>
  parseFloat(formatCurrency(value, code).format().replace(/\D/g, ''));

export default formatValue;
