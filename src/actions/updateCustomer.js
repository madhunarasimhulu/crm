import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function updateCustomer(
  customerId,
  accountId,
  credentials,
  payload,
) {
  return (dispatch) =>
    Accounts.updateCustomer(customerId, accountId, credentials, payload).then(
      (res) => {
        dispatch(getCustomerAccount(customerId, accountId, credentials));
        return res;
      },
    );
}
