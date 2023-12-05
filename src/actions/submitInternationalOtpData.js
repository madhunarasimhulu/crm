import { Customers } from 'clients';
import { logError } from '../utils';
import setInternationalOtpData from './setInternationalOtpData';
import getAccountDetails from './getAccountDetails';
import closeInternationalOtp from './closeInternationalOtp';
import clearOtpData from './clearOtpData';
import openAccountBlockedModal from './openAccountBlockedModal';

const submitInternationalOtpData =
  (data, account_status, status_reason_id) => (dispatch) => {
    const accountId = sessionStorage.getItem('pismo-account-id');
    return Customers.submitCustomerOnboardOtp(data)
      .then((data) => {
        dispatch(setInternationalOtpData(data));
        return data;
      })
      .catch((error) => {
        const OTP_MISMATCHED = 'otp mismatched';
        const MAX_LIMIT_TAKEN = 'maximum attempt taken';
        const OTP_MISMATCHED_ERROR = 'Wrong OTP Entered';
        const OTP_VERIFICATION_FAILED_ERROR = 'OTP verification failed';
        if (error?.response?.data?.msg === OTP_MISMATCHED) {
          dispatch(
            setInternationalOtpData({
              success: false,
              msg: OTP_MISMATCHED_ERROR,
            }),
          );
        } else if (error?.response?.data?.msg === MAX_LIMIT_TAKEN) {
          dispatch(
            setInternationalOtpData({ success: false, msg: MAX_LIMIT_TAKEN }),
          );
          setTimeout(() => {
            dispatch(getAccountDetails(accountId));
            setTimeout(async () => {
              await dispatch(closeInternationalOtp());
              await dispatch(clearOtpData());
              if (
                account_status === 'BLOCKED' &&
                status_reason_id ===
                  Number(process.env.REACT_APP_MAX_OTP_ATTEMPT_STATUS_REASON_ID)
              ) {
                await dispatch(openAccountBlockedModal());
              }
            }, 2000);
          }, 10000);
        } else {
          dispatch(
            setInternationalOtpData({
              success: false,
              msg: OTP_VERIFICATION_FAILED_ERROR,
            }),
          );
        }
      });
  };

export default submitInternationalOtpData;
