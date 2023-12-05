import { BankAccounts } from '../clients';
import { setAccountHolders } from '.';

const getAccountHolders = (accountId, credentials) => (dispatch) =>
  BankAccounts.getAccountHolders(accountId, credentials).then((data) =>
    dispatch(setAccountHolders(data)),
  );

export default getAccountHolders;
