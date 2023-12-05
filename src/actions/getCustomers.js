import { Customers } from '../clients';
import { startCustomersFetching, setCustomerSearchResults } from '.';
import { logError } from '../utils';

const getCustomers = (search, credentials) => (dispatch) => {
  dispatch(startCustomersFetching());

  return Customers.find(search, credentials)
    .then((data) => {
      dispatch(setCustomerSearchResults(data));
      return data;
    })
    .catch(logError);
};

export default getCustomers;
