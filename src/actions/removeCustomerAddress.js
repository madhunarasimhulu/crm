import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function removeCustomerAddress(
  customerId,
  accountId,
  credentials,
  addressId,
) {
  return (dispatch) =>
    Accounts.removeAccountAddress(accountId, addressId, credentials).then(
      (res) => {
        dispatch(getCustomerAccount(customerId, accountId, credentials));
        return res;
      },
    );
}
