import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CongratulationsPage } from './Congratulations';
import { OnboardOtp } from './OnboardOtp';
import { OnboardOtpStatus } from './OnboardOtpStatus';
import getCustomerOnboardOtpData from 'actions/getCustomerOnboardOtp';
import submitCustomerOnboardOtpData from 'actions/submitOnboardCustomerOtp';
import { Welcome } from './Welcome';
import { getRequestErrorMessage } from 'utils';
import { showToast } from 'actions';
import { onBoardingConfig } from '../../utils/onBoarding/OnboardingConfig';
import './CustomerOnboard.scss';

export const CustomerOnBoard = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    account: { max_credit_limit = 0 },
    otpData: { success, msg },
  } = useSelector((state) => state.onBoard);
  const [step, setStep] = useState(1);
  const [errormsg, setErrormsg] = useState('');
  const [otpStatus, setOtpStatus] = useState(null);
  const [isOtpBtnDisabled, setOtpBtnDisabled] = useState(false);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setClientId(sessionStorage.getItem('clientId'));
  }, []);

  const initialOtpState = {
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    num5: '',
    num6: '',
  };

  const [otp, setOtp] = useState(initialOtpState);

  useEffect(() => {
    success ? setOtpStatus(true) : setOtpStatus(false);
  }, [success]);

  const handleConfirm = async () => {
    setOtpBtnDisabled(true);
    const data = {
      client: clientId,
      otptype: 'customerOnboard',
      cclimit: max_credit_limit,
    };
    await dispatch(getCustomerOnboardOtpData(data))
      .then(() => {
        setStep(2);
        setOtpBtnDisabled(false);
      })
      .catch((error) => {
        setOtpBtnDisabled(false);
        const msg = getRequestErrorMessage(error);
        window.setTimeout(() => {
          dispatch(
            showToast({
              message:
                error?.response?.data?.msg ||
                msg ||
                'OTP generation for Customer Onboarding is failed, Please try again',
              style: 'error',
            }),
          );
        }, 1000);
      });
  };

  const handleSubmit = () => {
    setOtpBtnDisabled(true);
    const documentId = JSON.parse(
      JSON.stringify(sessionStorage.getItem('pismo-document-number')),
    );
    const otpValue = Object.values(otp).reduce((a, b) => a + b);
    if (otpValue?.length >= 6) {
      const data = {
        client: clientId,
        otptype: 'customerOnboard',
        otp: otpValue,
        document_number: documentId,
      };
      const otpFlowNext = () => {
        setStep(3);
        setOtp({ ...initialOtpState });
        setOtpBtnDisabled(false);
        setErrormsg('');
      };
      dispatch(submitCustomerOnboardOtpData(data))
        .then(otpFlowNext)
        .catch(otpFlowNext);
    } else {
      setErrormsg('Please Enter 6 Digit OTP');
      setOtpBtnDisabled(false);
    }
  };

  const handleRetry = () => {
    setStep(2);
  };

  const handleNext = () => {
    setStep(4);
  };
  const handleIUnderstood = () => {
    setStep(1);
  };

  const getOnboardComponent = (step) => {
    switch (step) {
      case 1:
        return (
          <CongratulationsPage
            limit={max_credit_limit}
            handleConfirm={handleConfirm}
            isOtpBtnDisabled={isOtpBtnDisabled}
            onBoardingConfig={onBoardingConfig?.[clientId]}
          />
        );
      case 2:
        return (
          <OnboardOtp
            otp={otp}
            setOtp={setOtp}
            handleSubmit={handleSubmit}
            otpErrorMsg={msg}
            errormsg={errormsg}
            isOtpBtnDisabled={isOtpBtnDisabled}
            onBoardingConfig={onBoardingConfig?.[clientId]}
          />
        );
      case 3:
        return (
          <OnboardOtpStatus
            success={otpStatus}
            handleRetry={handleRetry}
            handleNext={handleNext}
            handleIUnderstood={handleIUnderstood}
            otpErrorMsg={msg}
            onBoardingConfig={onBoardingConfig?.[clientId]}
          />
        );
      case 4:
        return <Welcome onBoardingConfig={onBoardingConfig?.[clientId]} />;
      default:
        break;
    }
  };

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <section className="onboard-root">
      <div className="onboard-wrapper">{getOnboardComponent(step)}</div>
    </section>
  );
};
