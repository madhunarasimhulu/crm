import { Statements } from '../clients';
import { updatePaymentSplitInvoice, setTotalDueSplitInvoice } from '.';

const type = 'GET_PAYMENT_SPLIT_INVOICE_OPTIONS';

const getPaymentSplitInvoiceOptions =
  (accountId, upfrontAmount, credentials) => (dispatch) => {
    dispatch(
      updatePaymentSplitInvoice({
        show: true,
        loading: true,
        selectedIndexOption: 0,
      }),
    );
    return Statements.getSplitInvoiceOptions(
      accountId,
      upfrontAmount,
      credentials,
    )
      .then((data) => {
        dispatch(setTotalDueSplitInvoice(data));
        dispatch(
          updatePaymentSplitInvoice({
            loading: false,
          }),
        );
      })
      .catch((error) => {
        dispatch(
          updatePaymentSplitInvoice({
            loading: false,
            error,
            errorState: true,
          }),
        );
      });
  };

export { type };
export default getPaymentSplitInvoiceOptions;
