import { Customers } from 'clients';
import { logError } from '../utils';
import setCustomerOnboardOtpData from './setCustomerOnboardOtpData';
import startCustomerOnboard from './startCustomerOnboard';

const getCustomerOnboardOtpData = (data) => (dispatch) => {
  dispatch(startCustomerOnboard());

  return Customers.getCustomerOnboardOtp(data)
    .then((data) => {
      dispatch(setCustomerOnboardOtpData(data));
      return data;
    })
    .catch(logError);
};

export default getCustomerOnboardOtpData;
