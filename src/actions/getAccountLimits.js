import { Accounts } from '../clients';

const getAccountLimits = (accountId, credentials) => (dispatch) => {
  let request;
  request = Accounts.getAccountLimits(accountId, credentials);
  return request.then((res) => res).catch((err) => err);
};

export default getAccountLimits;
