import { Typography } from '@material-ui/core';
import IndianStates from './IndianStates.json';
import React, { useState } from 'react';

export default function NewAddressVerForm({
  newAddress,
  handleNewAddressChange,
}) {
  return (
    <form className="NewAddressVerForm">
      <Typography className="labelText">Type</Typography>
      <input
        type="radio"
        id="RESIDENTIAL"
        name="type"
        value="RESIDENTIAL"
        checked={newAddress.type === 'RESIDENTIAL'}
        onChange={handleNewAddressChange}
        hidden
      />
      <input
        type="radio"
        id="COMMERCIAL"
        name="type"
        value="COMMERCIAL"
        checked={newAddress.type === 'COMMERCIAL'}
        onChange={handleNewAddressChange}
        hidden
      />

      <input
        type="radio"
        id="OTHER"
        name="type"
        value="OTHER"
        checked={newAddress.type === 'OTHER'}
        onChange={handleNewAddressChange}
        hidden
      />
      <div className="addressTypeGroup">
        <label
          htmlFor="RESIDENTIAL"
          className={`addressType ${
            newAddress.type === 'RESIDENTIAL' ? 'addressTypeActive' : ''
          }`}
        >
          <center>Residential</center>
        </label>
        <label
          htmlFor="COMMERCIAL"
          className={`addressType ${
            newAddress.type === 'COMMERCIAL' ? 'addressTypeActive' : ''
          }`}
        >
          <center>Business</center>
        </label>
        <label
          htmlFor="OTHER"
          className={`addressType ${
            newAddress.type === 'OTHER' ? 'addressTypeActive' : ''
          }`}
        >
          <center>Other</center>
        </label>
      </div>

      <div className="addressVerMainGroup">
        <div className="addressVerSubGroup">
          <Typography className="labelText">House/Suite #:</Typography>
          <input
            type="text"
            name="number"
            value={newAddress.number}
            onChange={handleNewAddressChange}
          />
        </div>
        <div className="select-state-group">
          <Typography className="labelText">Building Name/ Street:</Typography>
          <input
            type="text"
            name="neighborhood"
            value={newAddress.neighborhood}
            onChange={handleNewAddressChange}
          />
        </div>
      </div>
      <div style={{ paddingTop: '24px' }}>
        <Typography className="labelText">Neighbourhood/ Area:</Typography>
        <input
          type="text"
          name="address"
          value={newAddress.address}
          onChange={handleNewAddressChange}
          className="w-100"
        />
      </div>
      <div className="addressVerMainGroup">
        <div className="addressVerSubGroup">
          <Typography className="labelText">City</Typography>
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleNewAddressChange}
          />
        </div>
        <div className="select-state-group">
          <Typography className="labelText">State</Typography>
          <select
            id="state"
            value={newAddress.state}
            onChange={handleNewAddressChange}
            name="state"
            className="select-state"
          >
            <option value="">Please select your state</option>
            {IndianStates.map((state, index) => (
              <option value={state['code']} key={`state${index}`}>
                {state['name'] + ' ' + '(' + state['code'] + ')'}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mailingAddressGroup addressVerMainGroup">
        <div className="addressVerSubGroup">
          <Typography className="labelText">Country</Typography>
          <input
            type="text"
            name="country"
            value={newAddress.country}
            readOnly
          />
        </div>
        <div className="addressVerSubGroup">
          <Typography className="labelText">Zip Code</Typography>
          <input
            type="text"
            name="zip_code"
            value={newAddress.zip_code}
            onChange={handleNewAddressChange}
          />
        </div>
        <div className="addressVerSubGroup mailingAddress">
          <Typography className="labelText">Mailing Address</Typography>
          <span>
            <div className="db v-mid Checkbox">
              <input
                id="isMailingAddress"
                type="checkbox"
                checked={newAddress.mailing_address === true}
                onChange={handleNewAddressChange}
                name="mailing_address"
                className="toggle toggle-round"
              />
              <label htmlFor="isMailingAddress">
                <span className="dib v-mid"></span>
              </label>
            </div>
          </span>
        </div>
      </div>
    </form>
  );
}
