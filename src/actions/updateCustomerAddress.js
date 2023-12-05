import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function updateCustomerAddress(
  customerId,
  accountId,
  credentials,
  addresses,
) {
  return (dispatch) => {
    const promises = addresses.map((address) => {
      const payload = {
        ...address,
        zip_code: address.zipcode,
      };

      if (address?.id) {
        return Accounts.updateAccountAddress(
          accountId,
          address.id,
          payload,
          credentials,
        );
      }

      return Accounts.createAccountAddress(accountId, payload, credentials);
    });

    return Promise.all(promises).then((res) => {
      dispatch(getCustomerAccount(customerId, accountId, credentials));
      return res;
    });
  };
}
