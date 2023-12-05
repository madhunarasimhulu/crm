import { BankSlips } from '../clients';
import { setRechargeSubmitting, setGeneratedRecharge } from '.';

const type = 'GENERATE_RECHARGE';

const generateRecharge =
  (accountId, amount, registred, credentials, send_email, send_sms) =>
  (dispatch) => {
    if (!send_email && !send_sms) {
      dispatch(setRechargeSubmitting(true));
    }

    return BankSlips.generateRecharge(
      accountId,
      amount,
      registred,
      credentials,
      send_email,
      send_sms,
    ).then((data) => dispatch(setGeneratedRecharge(data)));
  };

export { type };
export default generateRecharge;
