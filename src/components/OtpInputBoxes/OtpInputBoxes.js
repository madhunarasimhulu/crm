import React, { Suspense, lazy, useEffect, useState } from 'react';
import { InputFeedback, Label } from 'components/commons';
import '../../pages/CustomerOnboard/CustomerOnboard.scss';

const OtpInputBoxes = ({
  id,
  error,
  label,
  otp,
  handleOtpChange,
  disabled,
}) => {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    setClientId(sessionStorage.getItem('clientId'));
  }, []);

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
  return (
    <>
      <form style={{ margin: '0px 20px' }}>
        <Label htmlFor={id} error={error}>
          {label}
        </Label>
        <div
          className="px-1 onboard-input-group"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
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
                disabled={disabled}
              />
              <span className="opt-gap"></span>
            </div>
          ))}
        </div>
        <InputFeedback error={error} />
      </form>
    </>
  );
};

export default OtpInputBoxes;
