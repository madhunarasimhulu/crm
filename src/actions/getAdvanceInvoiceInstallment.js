import { Statements as StatementsClient } from '../clients';
import {
  setAdvanceInvoiceInstallment,
  setAdvanceInvoiceInstallmentError,
} from '.';

const getAdvanceInvoiceInstallment =
  (accountId, transactionId, credentials) => (dispatch) =>
    StatementsClient.getAccountInstallments(
      accountId,
      transactionId,
      credentials,
    )
      .then((data) => dispatch(setAdvanceInvoiceInstallment(data)))
      .catch((err) => dispatch(setAdvanceInvoiceInstallmentError(err)));

export default getAdvanceInvoiceInstallment;
