import { Statements as StatementsClient } from '../clients';
import {
  setConfirmCancelInvoiceInstallment,
  setCancelInvoiceInstallmentError,
  setCancelInvoiceInstallmentSubmitting,
} from '.';

const confirmCancelInvoiceInstallment =
  (accountId, transactionId, credentials) => (dispatch) => {
    dispatch(setCancelInvoiceInstallmentSubmitting(true));
    return StatementsClient.cancelAccountInstallments(
      accountId,
      transactionId,
      credentials,
    )
      .then((data) => dispatch(setConfirmCancelInvoiceInstallment(data)))
      .catch((err) => dispatch(setCancelInvoiceInstallmentError(err)));
  };

export default confirmCancelInvoiceInstallment;
