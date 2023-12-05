import React from 'react';
import { ListItem } from '.';
import { Loader } from '../../commons';

const LatestAuthorizations = ({ isLoading, items }) => {
  if (isLoading) {
    return (
      <div className="pv2 pv4-ns">
        <Loader color="white" size="small" />
      </div>
    );
  }

  return (
    <div>
      <ul className="list ma0 pa0">
        {items.map((item, index) => (
          <ListItem {...item} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default LatestAuthorizations;
