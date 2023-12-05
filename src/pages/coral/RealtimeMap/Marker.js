import React from 'react';

import RoomIcon from '@material-ui/icons/Room';
import { Tooltip } from '@material-ui/core';

export default function Marker({ city, transactions }) {
  // let color =
  //   String(authorization_category).toUpperCase() == "AUTHORIZATION"
  //     ? transactionStatus.success
  //     : transactionStatus.failure;
  const [ttypes, setTtypes] = React.useState({});

  React.useEffect(() => {
    let key = 'authorization_category';
    let grouped = transactions.reduce((prev, cur) => {
      (prev[cur[key]] = prev[cur[key]] || []).push(cur);
      return prev;
    }, {});

    setTtypes(grouped);
  }, [transactions]);

  return (
    <Tooltip
      title={`${city} -  ${Object.entries(ttypes).map(([key, value]) => {
        return `${key}: ${value?.length} `;
      })}`}
      placement="top"
    >
      <RoomIcon style={{ color: 'red' }} />
    </Tooltip>
  );
}
