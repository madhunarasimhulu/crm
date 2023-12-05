import { BankAccounts } from '../clients';
import { getAccountHolders } from '.';

const closeAccount = (payload, credentials) => (dispatch) =>
  dispatch(getAccountHolders(payload.accountId, credentials)).then((response) =>
    BankAccounts.cancelAccount(
      credentials,
      response.data.bankaccount,
      payload.reasonId,
      payload.comment,
    ),
  );
export default closeAccount;
