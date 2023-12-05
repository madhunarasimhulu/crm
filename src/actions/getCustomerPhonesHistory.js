import { Customers } from '../clients';
import {
  setCustomerPhonesHistory,
  setCustomerPhonesHistoryLoading,
  setCustomerPhonesHistoryError,
} from '.';
import { getRequestErrorMessage } from '../utils';

const getCustomerPhonesHistory =
  (customerId, accountId, credentials, active, type) => (dispatch) => {
    dispatch(setCustomerPhonesHistoryLoading(true));

    return Customers.getCustomerPhonesHistory(
      customerId,
      accountId,
      credentials,
      active,
      type,
    )
      .then((data) => dispatch(setCustomerPhonesHistory(data)))
      .catch((err) =>
        dispatch(
          setCustomerPhonesHistoryError({
            error: true,
            errorMsg: getRequestErrorMessage(err),
          }),
        ),
      );
  };

export default getCustomerPhonesHistory;
