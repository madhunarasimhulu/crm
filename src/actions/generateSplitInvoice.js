import { Statements } from '../clients';
import {
  setSplitInvoiceSubmitting,
  setGeneratedSplitInvoice,
  updatePaymentSplitInvoice,
  setAgreementConclusion,
} from '.';

const type = 'GENERATE_SPLIT_INVOICE';

const generateSplitInvoice =
  (
    accountId,
    amount,
    date,
    numberInstallments,
    credentials,
    send_email,
    send_sms,
    statement_agreement = false,
  ) =>
  (dispatch) => {
    if (!send_email && !send_sms) {
      dispatch(setSplitInvoiceSubmitting(true));
    }

    return Statements.generateSplitInvoice(
      accountId,
      amount,
      date,
      numberInstallments,
      credentials,
      send_email,
      send_sms,
      statement_agreement,
    ).then((data) => {
      if (!statement_agreement) {
        dispatch(setGeneratedSplitInvoice(data));
        dispatch(
          updatePaymentSplitInvoice({
            reviewSplitInvoice: false,
          }),
        );
      } else {
        dispatch(setAgreementConclusion(data));
      }
    });
  };

export { type };
export default generateSplitInvoice;
