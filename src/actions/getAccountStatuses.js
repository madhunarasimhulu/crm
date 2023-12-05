import { Accounts } from '../clients';
import { logError } from '../utils';
import setAccountStatuses from './setAccountStatuses';

export default function getAccountStatuses(credentials) {
  return (dispatch) => {
    Accounts.getStatuses(credentials)
      .then((data) => dispatch(setAccountStatuses(data)))
      .catch(logError);
  };
}
