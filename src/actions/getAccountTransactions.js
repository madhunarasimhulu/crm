import { Accounts } from '../clients';
import { setTransactionsLoading, setTransactions } from '.';
import { logError } from '../utils';

export default function getAccountTransactions(
  accountId,
  rangeDate,
  order,
  pagination,
  credentials,
) {
  return (dispatch) => {
    dispatch(setTransactionsLoading(true));

    return Accounts.getAccountTransactions(
      accountId,
      rangeDate,
      order,
      pagination,
      credentials,
    )
      .then((data) => {
        dispatch(setTransactions(data));
        return data;
      })
      .catch(logError);
  };
}
