import React from 'react';
import { FormattedMessage } from 'react-intl';
import Banner from '../../assets/img/banner.png';
import Checkmark from '../../assets/img/Checkmark.png';
import CrossMark from '../../assets/img/RailroadCrossing.png';
import { BsFillExclamationOctagonFill } from 'react-icons/bs';

export const OnboardOtpStatus = ({
  success,
  handleRetry,
  handleNext,
  otpErrorMsg,
  handleIUnderstood,
  onBoardingConfig,
}) => {
  const MAX_LIMIT_TAKEN = 'maximum attempt taken';
  return (
    <section className="onboard-content">
      <div className="onboard-page-title">
        <FormattedMessage
          id={`${
            success === true
              ? 'OTP Successfully Verified'
              : otpErrorMsg === MAX_LIMIT_TAKEN
              ? 'OTP Attempts Exceeded!'
              : 'Wrong OTP Entered'
          }`}
        />
      </div>
      <div className="onboard-status-img-container">
        {otpErrorMsg === MAX_LIMIT_TAKEN ? (
          <BsFillExclamationOctagonFill
            style={{ color: 'red', fontSize: '80px' }}
          />
        ) : (
          <img
            src={success === true ? Checkmark : CrossMark}
            width="80"
            alt="banner-img"
          />
        )}
      </div>
      <div className={success ? `onboard-message` : `onboard-message-normal`}>
        <FormattedMessage
          id={`${
            success === true
              ? 'Your application has been successfully submitted!'
              : otpErrorMsg === MAX_LIMIT_TAKEN
              ? 'You have exceeded the number of OTP attempts allowed, your account is now blocked! Please contact the customer support for further assistance.'
              : 'You have entered an incorrect OTP, please check the code and retry!'
          }`}
        />
      </div>
      <div className="onboard-btn-container">
        <button
          type="button"
          className="onboard-page-button"
          //   disabled={isLoading}
          id="target"
          onClick={
            success
              ? handleNext
              : otpErrorMsg === MAX_LIMIT_TAKEN
              ? handleIUnderstood
              : handleRetry
          }
        >
          <FormattedMessage
            id={`${
              success
                ? 'Next'
                : otpErrorMsg === MAX_LIMIT_TAKEN
                ? 'I Understand'
                : 'Retry'
            }`}
          />
        </button>
      </div>
      <div className="onboard-page-img-container">
        <img
          src={onBoardingConfig?.logo?.default}
          alt="banner-img"
          className="onboard-banner-img"
        />
      </div>
    </section>
  );
};
