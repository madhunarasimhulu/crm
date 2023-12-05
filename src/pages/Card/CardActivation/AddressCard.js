import { Typography } from '@material-ui/core';
import React from 'react';
import addressImg from 'assets/icons/address.svg';

export default function AddressCard({
  isCurrentResident,
  currentResAddress,
  onChangeHandle,
}) {
  return (
    <div>
      <div className="addressCard">
        <img src={addressImg} className="addressCardImg" alt="addressImg" />
        <div className="addressCardText">
          <Typography className="addressCardfont">
            {currentResAddress}
          </Typography>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <input
          type="checkbox"
          checked={isCurrentResident === true}
          onChange={onChangeHandle}
          className="addressVerf-checkbox"
        />
        <Typography
          style={{
            color: '#777777',
          }}
        >
          Yes this is my current residential address
        </Typography>
      </div>
    </div>
  );
}
