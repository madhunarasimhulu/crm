import { BankAccounts } from '../clients';
import { setLimits, setLimitsError } from '.';

const getLimits =
  ({ accountId }, credentials) =>
  (dispatch) =>
    BankAccounts.getLimits({ accountId }, credentials)
      .then((data) => dispatch(setLimits(data)))
      .catch(() => {
        dispatch(setLimitsError());
      });

export default getLimits;
