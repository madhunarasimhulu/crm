import { Customers } from '../clients';
import setCustomerProtocol from './setCustomerProtocol';
import { logError } from '../utils';

const openCustomerProtocol =
  (customerId, accountId, credentials) => (dispatch) =>
    // new Promise(resolve => resolve({ protocol: 'banana' })) // uncomment this to prevent generating protocols
    Customers.openCustomerProtocol(customerId, accountId, credentials) // and comment this
      .then((data) => {
        dispatch(setCustomerProtocol({ ...data, customerId, accountId }));
        return data && data.protocol;
      })
      .catch(logError);

export default openCustomerProtocol;
