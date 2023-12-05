import { Statements as StatementsClient } from '../clients';
import {
  setCancelInvoiceInstallment,
  setCancelInvoiceInstallmentError,
} from '.';

const getCancelInvoiceInstallment =
  (accountId, transactionId, credentials) => (dispatch) =>
    StatementsClient.getAccountInstallments(
      accountId,
      transactionId,
      credentials,
    )
      .then((data) => dispatch(setCancelInvoiceInstallment(data)))
      .catch((err) => dispatch(setCancelInvoiceInstallmentError(err)));

export default getCancelInvoiceInstallment;
