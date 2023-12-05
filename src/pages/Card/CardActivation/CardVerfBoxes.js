import { Typography } from '@material-ui/core';
import React from 'react';

export default function CardVerfBoxes({
  cvvExpiryDate,
  handleCvvExpiryDateChange,
  disabled = false,
}) {
  const cvvExpiryDateInputFocus = (ev) => {
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      const next = ev.target.tabIndex - 2;
      if (next > -1) {
        ev.target.form.elements[next].focus();
      }
    } else {
      const next = ev.target.tabIndex;
      if (next < 7) {
        ev.target.form.elements[next].focus();
      }
    }
  };

  return (
    <form className="CardVerfBoxes">
      <div>
        <Typography style={{ marginBottom: '12px', color: '#777777' }}>
          CVV
        </Typography>
        <div className="card-activation-form">
          {['1', '2', '3'].map((box, index) => (
            <div className="card-activation-input" key={`cvv${index}`}>
              <input
                value={cvvExpiryDate['num' + box]}
                type="password"
                inputMode="numeric"
                className="card-activation-field px-1"
                name={'num' + box}
                onChange={handleCvvExpiryDateChange}
                tabIndex={box}
                maxLength="1"
                onKeyUp={cvvExpiryDateInputFocus}
                disabled={disabled}
              />
              {box !== '3' && <div className="card-activation-gap"></div>}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Typography style={{ marginBottom: '12px', color: '#777777' }}>
          Expiry Date
        </Typography>
        <div className="card-activation-form">
          {['4', '5', '6', '7'].map((box, index) => (
            <div className="card-activation-input" key={`ExpiryDate${index}`}>
              <input
                value={cvvExpiryDate['num' + box]}
                type="password"
                inputMode="numeric"
                className="card-activation-field px-1"
                name={'num' + box}
                onChange={handleCvvExpiryDateChange}
                tabIndex={box}
                maxLength="1"
                onKeyUp={cvvExpiryDateInputFocus}
                disabled={disabled}
              />
              {box !== '5' && box !== '7' && (
                <div className="card-activation-gap"></div>
              )}
              {box === '5' && <div className="card-activation-gap-hash"></div>}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
