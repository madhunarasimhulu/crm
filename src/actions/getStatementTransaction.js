import { TransactionsCore } from '../clients';
import { getRequestErrorMessage } from '../utils';
import { setTransaction, setTransactionError } from '.';

export default function getStatementTransaction(
  transactionId,
  accountId,
  credentials,
) {
  return (dispatch) =>
    TransactionsCore.getTransaction(transactionId, accountId, credentials)
      .then((data) => dispatch(setTransaction(data)))
      .catch((err) =>
        dispatch(
          setTransactionError({
            error: true,
            errorMsg: getRequestErrorMessage(err),
          }),
        ),
      );
}
