import { Customers } from 'clients';
import { logError } from '../utils';
import setCustomerOnboardOtpData from './setCustomerOnboardOtpData';
import startCustomerOnboard from './startCustomerOnboard';

const submitCustomerOnboardOtpData = (data) => (dispatch) => {
  dispatch(startCustomerOnboard());
  return new Promise((resolve, reject) => {
    Customers.submitCustomerOnboardOtp(data)
      .then((data) => {
        dispatch(setCustomerOnboardOtpData(data));
        return data;
      })
      .catch((error) => {
        const OTP_MISMATCHED = 'otp mismatched';
        const MAX_LIMIT_TAKEN = 'maximum attempt taken';
        const OTP_MISMATCHED_ERROR = 'Wrong OTP Entered';
        const OTP_VERIFICATION_FAILED_ERROR = 'OTP verification failed';
        if (error?.response?.data?.msg === OTP_MISMATCHED) {
          dispatch(
            setCustomerOnboardOtpData({
              success: false,
              msg: OTP_MISMATCHED_ERROR,
            }),
          );
        } else if (error?.response?.data?.msg === MAX_LIMIT_TAKEN) {
          dispatch(
            setCustomerOnboardOtpData({ success: false, msg: MAX_LIMIT_TAKEN }),
          );
        } else {
          dispatch(
            setCustomerOnboardOtpData({
              success: false,
              msg: OTP_VERIFICATION_FAILED_ERROR,
            }),
          );
        }
        logError();
      })
      .then(resolve)
      .catch(reject);
  });
};

export default submitCustomerOnboardOtpData;
