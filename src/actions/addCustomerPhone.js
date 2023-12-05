import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function addCustomerPhone(
  customerId,
  accountId,
  credentials,
  data,
) {
  return (dispatch) =>
    Accounts.addCustomerPhone(customerId, accountId, credentials, data).then(
      (res) => {
        dispatch(getCustomerAccount(customerId, accountId, credentials));
        return res;
      },
    );
}
