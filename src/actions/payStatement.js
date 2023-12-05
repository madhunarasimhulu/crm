import { Payments } from '../clients';
import { getRequestErrorMessage, delay } from '../utils';
import { closePayment, showToast } from '.';
import setPayStatement from './setPayStatement';

export default function payStatement(
  accountId,
  amountInput,
  messages,
  routeWatcher,
  credentials,
) {
  return (dispatch) => {
    Payments.payStatement(accountId, amountInput, credentials)
      .then(async () => {
        await delay(3000);
        routeWatcher.reload();
      })
      .then((data) => {
        dispatch(setPayStatement(data));
        dispatch(showToast(messages.success));
        dispatch(closePayment());
      })
      .catch((err) => {
        dispatch(
          setPayStatement({
            error: true,
            errorMsg: getRequestErrorMessage(err),
          }),
        );

        dispatch(
          showToast({
            message: messages.error,
            style: 'error',
          }),
        );
      });
  };
}
