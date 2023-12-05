import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import OtpBoxes from './OtpBoxes';
import {
  BsFillExclamationCircleFill,
  BsFillCheckCircleFill,
} from 'react-icons/bs';
import { Customers } from 'clients';
import { getAccountDetails, openAccountBlockedModal, showToast } from 'actions';
import getRequestErrorMsg from 'utils/getRequestErrorMsg/getRequestErrorMsg';
import { useDispatch } from 'react-redux';

const initialOtpState = {
  num1: '',
  num2: '',
  num3: '',
  num4: '',
  num5: '',
  num6: '',
};

export default function EmailRegistration({
  account_status,
  status_reason_id,
  setEmailVerifySuccess,
  accountId,
  setVerfFailedPopUp,
  handleModalClose,
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(60);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [verifyBtnDisabled, setVerifyBtnDisabled] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [otp, setOtp] = useState({ ...initialOtpState });
  const dispatch = useDispatch();
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setClientId(sessionStorage.getItem('clientId'));
  }, []);

  const handleOtpChange = (event) => {
    if (event.target.value < 10) {
      setOtp((prevFormData) => {
        event.keyCode = 9;
        return {
          ...prevFormData,
          [event.target.name]: event.target.value,
        };
      });
    }
  };

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(null);
  };

  const onSaveEmail = async (email) => {
    setOtp({ ...initialOtpState });
    setErrorMsg(null);
    if (email === '') {
      setError('Please enter Email');
    } else if (!isValidEmail(email)) {
      setError('Email is invalid');
    } else {
      setError(null);
      setStartTime(new Date().getTime());
      const data = {
        client: clientId,
        otptype: 'updateEmail',
        email: email,
      };
      await Customers.getCustomerOnboardOtp(data)
        .then(() => {
          // dispatch(openInternationalOtp());
        })
        .catch((error) => {
          const msg = getRequestErrorMsg(error);
          window.setTimeout(() => {
            dispatch(
              showToast({
                message:
                  error?.response?.data?.msg ||
                  msg ||
                  'OTP generation for Email registration is failed, Please try again',
                style: 'error',
              }),
            );
          }, 1000);
        });
    }
  };

  useEffect(() => {
    if (startTime) {
      setIsBtnDisabled(true);
      const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);

        const seconds = 60 - elapsedTime;
        if (seconds <= 0) {
          clearInterval(timer);
        }

        setRemainingTime(seconds);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [startTime]);

  useEffect(() => {
    if (remainingTime === 0) {
      setIsBtnDisabled(false);
    }
  }, [remainingTime]);

  const onVerifyEmail = async (EmailOtp) => {
    const otpValue = Object.values(EmailOtp)
      .reduce((a, b) => a + b)
      .trim();
    if (otpValue?.length === 6) {
      setVerifyBtnDisabled(true);
      const data = {
        otptype: 'updateEmail',
        email: email,
        otp: otpValue,
      };
      await Customers.submitCustomerOnboardOtp(
        data,
        account_status,
        status_reason_id,
      )
        .then((response) => {
          if (response?.success) {
            setEmailVerifySuccess(true);
            setShowEmailSuccess(true);
            setErrorMsg('');
          }
        })
        .catch((error) => {
          const OTP_MISMATCHED = 'otp mismatched';
          const MAX_LIMIT_TAKEN = 'maximum attempt taken';
          const OTP_MISMATCHED_ERROR = 'Wrong OTP Entered';
          const OTP_VERIFICATION_FAILED_ERROR = 'OTP verification failed';
          if (error?.response?.data?.msg === OTP_MISMATCHED) {
            setErrorMsg(OTP_MISMATCHED_ERROR);
            setOtp({ ...initialOtpState });
          } else if (error?.response?.data?.msg === MAX_LIMIT_TAKEN) {
            setErrorMsg(MAX_LIMIT_TAKEN);
            setVerfFailedPopUp(true);
          } else {
            setOtp({ ...initialOtpState });
            setErrorMsg(OTP_VERIFICATION_FAILED_ERROR);
          }
          setVerifyBtnDisabled(false);
        });
    } else {
      setErrorMsg('Please Enter 6 Digit OTP');
    }
  };

  return (
    <div className="email-reg">
      <Typography component="p" className="email-modalText">
        <center>
          {showEmailSuccess
            ? 'E-Mail address verified successfully'
            : 'We will send a security code to your preferred E-Mail address to verify it'}
        </center>
      </Typography>
      <div className="email-input-dev">
        <div className="">
          <input
            type="email"
            inputMode="email"
            name="initialPin"
            value={email}
            onChange={handleEmailChange}
            className="email-field"
            placeholder="Enter E-mail"
            required={true}
          />

          {isBtnDisabled && showEmailSuccess === false ? (
            <label style={{ fontStyle: 'italic', color: '#ccc' }}>
              {remainingTime >= 0
                ? `Retry in ${
                    remainingTime < 10 ? `0${remainingTime}` : remainingTime
                  } seconds..`
                : ''}
            </label>
          ) : (
            <div className="email-error">
              <label>{error}</label>
            </div>
          )}
        </div>
        <div>
          <center>
            {showEmailSuccess ? (
              <button
                className={`email-btn`}
                style={{ backgroundColor: 'transparent' }}
              >
                <BsFillCheckCircleFill
                  style={{
                    fontSize: '40px',
                    color: '#48bd5a',
                  }}
                />
              </button>
            ) : (
              <button
                type="button"
                className={`email-btn ${
                  isBtnDisabled ? 'email-btn-disabled' : ''
                }`}
                onClick={() => {
                  onSaveEmail(email);
                }}
                disabled={isBtnDisabled}
              >
                {isBtnDisabled ? 'Code Sent' : 'Send Code'}
              </button>
            )}
          </center>
        </div>
      </div>
      <div style={{ marginTop: '30px' }}></div>
      {isBtnDisabled && showEmailSuccess === false ? (
        <div>
          <div className="email-verfy">
            <label>Verification Code</label>
          </div>
          <div className="email-input-dev">
            <div>
              <OtpBoxes
                otp={otp}
                handleOtpChange={handleOtpChange}
                disabled={errorMsg === 'maximum attempt taken'}
              />
            </div>
            <div className="emailVerify-btn">
              <center>
                <button
                  type="button"
                  className={`email-btn ${
                    verifyBtnDisabled ? 'email-btn-disabled' : ''
                  }`}
                  onClick={() => {
                    onVerifyEmail(otp);
                  }}
                >
                  Verify
                </button>
              </center>
            </div>
          </div>
          <div className="email-otp-error">
            <center>
              {errorMsg != null && errorMsg != '' ? (
                <label>
                  <span>
                    <BsFillExclamationCircleFill />
                    &nbsp;
                  </span>
                  {errorMsg}
                </label>
              ) : (
                ''
              )}
            </center>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
