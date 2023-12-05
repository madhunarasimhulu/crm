import { Accounts } from '../clients';
import { logError } from '../utils';
import setAccountReasons from './setAccountReasons';

export default function getAccountReasons(statusId, credentials) {
  return (dispatch) => {
    Accounts.getStatusesReasons(statusId, credentials)
      .then((data) => dispatch(setAccountReasons(data)))
      .catch(logError);
  };
}
