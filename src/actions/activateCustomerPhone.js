import { Accounts } from '../clients';
import getCustomerAccount from './getCustomerAccount';

export default function activateCustomerPhone(
  customerId,
  accountId,
  credentials,
  phone,
) {
  if (!customerId) throw new Error('customerId not provided.');
  if (!accountId) throw new Error('accountId not provided.');
  if (!credentials) throw new Error('credentials not provided.');
  if (!phone) throw new Error('phone not provided.');

  const active = true;

  return (dispatch) =>
    Accounts.updateAccountPhone(
      accountId,
      phone.id,
      {
        type: phone.type,
        active,
      },
      credentials,
    ).then((res) => {
      dispatch(getCustomerAccount(customerId, accountId, credentials));
      return res;
    });
}
