import { Statements as StatementsClient } from '../clients';
import {
  setConfirmAdvanceInvoiceInstallment,
  setAdvanceInvoiceInstallmentError,
  setAdvanceInvoiceInstallmentSubmitting,
} from '.';

const confirmAdvanceInvoiceInstallment =
  (installmentsToAdvance, accountId, transactionId, credentials) =>
  (dispatch) => {
    dispatch(setAdvanceInvoiceInstallmentSubmitting(true));
    return StatementsClient.advanceAccountInstallments(
      installmentsToAdvance,
      accountId,
      transactionId,
      credentials,
    )
      .then((data) => dispatch(setConfirmAdvanceInvoiceInstallment(data)))
      .catch((err) => dispatch(setAdvanceInvoiceInstallmentError(err)));
  };

export default confirmAdvanceInvoiceInstallment;
