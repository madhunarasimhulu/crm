import { BankAccounts } from '../clients';
import { getCustomerAccount } from '.';

const updateAccountStatus =
  (
    { accountId, status, customerId, reason_id, description = '' },
    credentials,
  ) =>
  (dispatch) =>
    BankAccounts.changeAccountStatus(
      accountId,
      status,
      credentials,
      parseInt(reason_id, 10),
      description,
    )
      .then((data) => {
        if (data.error) {
          return data;
        }

        dispatch(getCustomerAccount(customerId, accountId, credentials));
        return data;
      })
      .catch((err) => err);

export default updateAccountStatus;
