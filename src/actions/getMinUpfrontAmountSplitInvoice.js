import { Statements } from '../clients';
import { setMinUpfrontAmountSplitInvoice } from '.';

const type = 'GET_MIN_UPFRONT_AMOUNT_SPLIT_INVOICE';

const getMinUpfrontAmountSplitInvoice =
  (accountId, statementId, credentials) => (dispatch) =>
    Statements.getStatement(accountId, statementId, credentials).then((data) =>
      dispatch(setMinUpfrontAmountSplitInvoice(data)),
    );

export { type };
export default getMinUpfrontAmountSplitInvoice;
