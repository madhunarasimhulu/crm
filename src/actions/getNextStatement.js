import { Statements } from '../clients';
import { logError } from '../utils';

export default function getNextStatement(accountId, credentials) {
  return () =>
    Statements.getNextStatement(accountId, credentials)
      .then((data) => data)
      .catch(logError);
}
