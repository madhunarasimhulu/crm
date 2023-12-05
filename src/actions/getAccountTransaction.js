import { CRM } from '../clients';
import { mapTransaction, getRequestErrorMessage } from '../utils';
import { setTransaction, setTransactionError } from '.';

export default function getAccountTransaction(
  customerId,
  accountId,
  transactionId,
  credentials,
) {
  return (dispatch) =>
    CRM.getAccountTransaction(customerId, accountId, transactionId, credentials)
      .then(mapTransaction)
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
