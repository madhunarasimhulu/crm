import { Transactions } from '../clients';

export default function getDisputes(filter, status, credentials) {
  return () => Transactions.getDisputes(null, null, credentials);
}
