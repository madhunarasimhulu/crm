import { Accounts } from '../clients';
import {
  setCustomerLatestAuthorizationsLoading,
  setCustomerLatestAuthorizations,
} from '.';
import { logError } from '../utils';

let isRefresh = false;

let authorizationsData;

const getCustomerLatestAuthorizations =
  (customerId, credentials) => (dispatch) => {
    if (isRefresh) {
      return dispatch(setCustomerLatestAuthorizations(authorizationsData));
    }
    dispatch(setCustomerLatestAuthorizationsLoading(true));

    return Accounts.getLatestAuthorizations(customerId, credentials)
      .then((data) => {
        authorizationsData = data;
        dispatch(setCustomerLatestAuthorizations(data));
        isRefresh = true;
        return authorizationsData;
      })
      .catch((err) => {
        dispatch(setCustomerLatestAuthorizationsLoading(false));
        logError(err);
      });
  };

export default getCustomerLatestAuthorizations;
