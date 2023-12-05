import { Customers } from '../clients';
import { setCustomerDetail } from '.';
import { logError } from '../utils';

const getCustomerDetail = (customerId, accountId, credentials) => (dispatch) =>
  Customers.getCustomerDetail(customerId, accountId, credentials)
    .then((data) => {
      dispatch(setCustomerDetail(data));
      return data;
    })
    .catch(logError);

export default getCustomerDetail;
