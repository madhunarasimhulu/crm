import { Customers } from '../clients';
import setCustomerDueDates from './setCustomerDueDates';
import { logError } from '../utils';

export default function getCustomerDueDate(programId, credentials) {
  return (dispatch) =>
    Customers.getCustomerDueDate(programId, credentials)
      .then((response) => dispatch(setCustomerDueDates(response)))
      .catch(logError);
}
