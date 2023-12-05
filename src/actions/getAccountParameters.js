import { Accounts } from '../clients';
import { logError } from '../utils';
import setAccountParameters from './setAccountParameters';

export default function getAccountParameters(accountId, credentials) {
  return (dispatch) => {
    Accounts.getAccountParameters(accountId, credentials)
      .then((data) => dispatch(setAccountParameters(data)))
      .catch(logError);
  };
}
