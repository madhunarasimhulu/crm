import React from 'react';
import { Typography } from '@material-ui/core';

export default function SetPINcard({ pin, handlePinChange }) {
  return (
    <div className="setPINcard">
      <Typography component="p" className="modalText">
        <center>Please enter your desired 4 digit PIN</center>
      </Typography>
      <center>
        <input
          type="password"
          inputMode="numeric"
          name="initialPin"
          value={pin?.initialPin}
          onChange={handlePinChange}
          className="pin-field"
          maxLength={4}
          minLength={4}
        />
      </center>
      <Typography component="p" className="modalText">
        <center>Please re-enter your desired 4 digit PIN</center>
      </Typography>
      <center>
        <input
          type="password"
          inputMode="numeric"
          name="confirmPin"
          value={pin?.confirmPin}
          onChange={handlePinChange}
          maxLength={4}
          minLength={4}
        />
      </center>
    </div>
  );
}
