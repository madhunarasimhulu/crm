import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function updateCustomerPhone(
  customerId,
  accountId,
  phoneId,
  payload,
  credentials,
) {
  return (dispatch) =>
    Accounts.updateAccountPhone(accountId, phoneId, payload, credentials).then(
      (res) => {
        dispatch(getCustomerAccount(customerId, accountId, credentials));
        return res;
      },
    );
}
