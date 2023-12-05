import React from 'react';

export default function OtpBoxes({ otp, handleOtpChange, disabled = false }) {
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
    <form className="card-activation-form">
      {['1', '2', '3', '4', '5', '6'].map((box, index) => (
        <div className="card-activation-input" key={index}>
          <input
            type="text"
            inputMode="numeric"
            className="card-activation-field px-1"
            name={'num' + box}
            key={index}
            onChange={handleOtpChange}
            tabIndex={box}
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
            value={otp['num' + box]}
            disabled={disabled}
          />
          {box != '6' && <div className="card-activation-gap"></div>}
        </div>
      ))}
    </form>
  );
}
