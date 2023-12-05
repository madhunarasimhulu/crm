import Accounts from '../clients/Accounts';

const savingAccountParameter = (nextValue, id, accountId, credentials) => () =>
  Accounts.updateAccountParameters(nextValue, id, accountId, credentials);

export default savingAccountParameter;
