import { Customers } from '../clients';
import { startCustomersFetching, setCustomerSearchResults } from '.';
import { logError } from '../utils';

const getCustomersV2 = (search, credentials) => (dispatch) => {
  dispatch(startCustomersFetching());

  return Customers.findV2(search, credentials)
    .then((data) => {
      dispatch(setCustomerSearchResults(data));
      return data;
    })
    .catch(logError);
};

export default getCustomersV2;
