import { Statements } from '../clients';
import { setPaymentSubmitting, setGeneratedPayment } from '.';

const type = 'GENERATE_PAYMENT';

const generatePayment =
  (accountId, amount, date, credentials, send_email, send_sms) =>
  (dispatch) => {
    if (!send_email && !send_sms) {
      dispatch(setPaymentSubmitting(true));
    }

    return Statements.generatePayment(
      accountId,
      amount,
      date,
      credentials,
      send_email,
      send_sms,
    )
      .then((data) => dispatch(setGeneratedPayment(data)))
      .catch(() => {
        dispatch(setPaymentSubmitting(false));
        return Promise.reject();
      });
  };

export { type };
export default generatePayment;
