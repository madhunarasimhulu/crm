import { Customers } from 'clients';
import setCustomerOnboardData from './setCustomerOnboardData';
import startCustomerOnboard from './startCustomerOnboard';
import showToast from './showToast';

const submitCustomerOnboardData = (data) => (dispatch) => {
  dispatch(startCustomerOnboard());

  return Customers.submitCustomerOnboard(data)
    .then((data) => {
      dispatch(setCustomerOnboardData(data));
      return data;
    })
    .catch((error) => {
      dispatch(
        showToast({
          message: error?.response?.data?.msg || 'something went wrong',
          style: 'error',
        }),
      );
    });
};

export default submitCustomerOnboardData;
