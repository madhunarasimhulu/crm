import { Customers } from 'clients';
import { logError } from '../utils';
import setInternationalOtpData from './setInternationalOtpData';
import startCustomerOnboard from './startCustomerOnboard';

const getInternationalOtpData = (data) => (dispatch) => {
  // dispatch(startCustomerOnboard());

  return Customers.getCustomerOnboardOtp(data)
    .then((data) => {
      dispatch(setInternationalOtpData(data));
      return data;
    })
    .catch(logError);
};

export default getInternationalOtpData;
