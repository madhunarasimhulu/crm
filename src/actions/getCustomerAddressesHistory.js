import { Customers } from '../clients';
import {
  setCustomerAddressesHistory,
  setCustomerAddressesHistoryLoading,
  setCustomerAddressesHistoryError,
} from '.';
import { getRequestErrorMessage } from '../utils';

const getCustomerAddressesHistory =
  (customerId, accountId, credentials, active, type) => (dispatch) => {
    dispatch(setCustomerAddressesHistoryLoading(true));

    return Customers.getCustomerAddressesHistory(
      customerId,
      accountId,
      credentials,
      active,
      type,
    )
      .then((data) => dispatch(setCustomerAddressesHistory(data)))
      .catch((err) =>
        dispatch(
          setCustomerAddressesHistoryError({
            error: true,
            errorMsg: getRequestErrorMessage(err),
          }),
        ),
      );
  };

export default getCustomerAddressesHistory;
