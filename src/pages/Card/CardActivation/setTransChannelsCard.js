import React from 'react';
import { Typography } from '@material-ui/core';

export default function SetTransChannelsCard() {
  const channels = ['E-COMMERCE', 'POS [CHIP]', 'POS [NFC]', 'ATM WITHDAWAL'];
  return (
    <div className="setTransChannelsCard">
      <div className="modalText mb-3">
        {channels.map((channel, index) => (
          <div className="transChip" key={`transChip${index}`}>
            <Typography>{channel}</Typography>
            <div className="db v-mid Checkbox">
              <input
                id="transChipInput"
                type="checkbox"
                checked={true}
                onChange={() => {}}
                className="toggle toggle-round"
                disabled
              />
              <label htmlFor="transChipInput">
                <span className="dib v-mid"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
      <Typography component="p" className="modalText">
        <center>
          <li>the limits are currently enabled by default</li>
        </center>
      </Typography>
      <center>
        <Typography
          variant="h6"
          component="h6"
          className="modalTextLTC mx-13 maxW-380"
        >
          Do you want to change the status of your transaction channels?
        </Typography>
      </center>
    </div>
  );
}
