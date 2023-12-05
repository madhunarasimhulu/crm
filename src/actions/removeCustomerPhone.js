import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function removeCustomerPhone(
  customerId,
  accountId,
  credentials,
  phone,
) {
  if (!customerId) throw new Error('customerId not provided.');
  if (!accountId) throw new Error('accountId not provided.');
  if (!credentials) throw new Error('credentials not provided.');
  if (!phone) throw new Error('phone not provided.');

  const active = false;

  return (dispatch) =>
    Accounts.updateAccountPhone(accountId, phone, credentials, active).then(
      (res) => {
        dispatch(getCustomerAccount(customerId, accountId, credentials));
        return res;
      },
    );
}
