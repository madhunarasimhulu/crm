import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Banner from '../../assets/img/banner.png';

export const OnboardOtp = ({
  otp,
  setOtp,
  handleSubmit,
  otpErrorMsg,
  errormsg,
  isOtpBtnDisabled,
  onBoardingConfig,
}) => {
  const MAX_LIMIT_TAKEN = 'maximum attempt taken';

  const [otpMsg, setOtpMsg] = useState('');

  useEffect(() => {
    if (errormsg != '' && errormsg === 'Please Enter 6 Digit OTP') {
      setOtpMsg(errormsg);
    } else {
      setOtpMsg(otpErrorMsg);
    }
  });

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

  const inputfocus = (elmnt) => {
    if (elmnt.key === 'Delete' || elmnt.key === 'Backspace') {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const OtpBoxes = (
    <div>
      <div className="px-1 onboard-input-group">
        {['1', '2', '3', '4', '5', '6'].map((box, index) => (
          <div className="onboard-otp-input" key={index}>
            <input
              type="text"
              inputMode="numeric"
              className="otp-field px-1"
              name={'num' + box}
              key={index}
              onChange={(event) => handleOtpChange(event, index)}
              tabIndex={box}
              maxLength="1"
              onKeyUp={(e) => inputfocus(e)}
              value={otp['num' + box]}
              disabled={otpMsg === MAX_LIMIT_TAKEN ? true : false}
            />
            <span className="opt-gap"></span>
          </div>
        ))}
      </div>
      <div className="otperrorlabel">
        {otpMsg && otpMsg != MAX_LIMIT_TAKEN && <label>{otpMsg}</label>}
      </div>
    </div>
  );

  return (
    <section className="onboard-content">
      <form>
        <div className="onboard-page-title">
          <FormattedMessage id={`OTP Verification`} />
        </div>
        <div className="d-flex onboard-otp-container">{OtpBoxes}</div>
        <div className="onboard-message">
          {otpMsg === MAX_LIMIT_TAKEN ? (
            <FormattedMessage
              id={`Your account has been blocked due to 5 failed attempts of OTP`}
            />
          ) : (
            <FormattedMessage
              id={`Please enter the “One Time Password(OTP)” sent to your registered mobile number`}
            />
          )}
        </div>

        <div className="onboard-btn-container">
          <button
            type="button"
            className={`${
              isOtpBtnDisabled === true ||
              otpMsg === MAX_LIMIT_TAKEN ||
              Object.values(otp)
                .reduce((a, b) => a + b)
                .trim().length !== 6
                ? 'onboard-page-button-disabled'
                : 'onboard-page-button'
            }`}
            disabled={isOtpBtnDisabled === true || otpMsg === MAX_LIMIT_TAKEN}
            onClick={handleSubmit}
          >
            <FormattedMessage id={`Submit`} />
          </button>
        </div>

        <div className="onboard-page-img-container">
          <img
            src={onBoardingConfig?.logo?.default}
            alt="banner-img"
            className="onboard-banner-img"
          />
        </div>
      </form>
    </section>
  );
};
