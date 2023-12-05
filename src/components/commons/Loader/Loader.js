import React from 'react';
import PropTypes from 'prop-types';

import './Loader.scss';

const Loader = ({ size, color }) => {
  let sizeAcronym;

  switch (size) {
    case 'small':
      sizeAcronym = 'sm';
      break;
    case 'extra-small':
      sizeAcronym = 'xs';
      break;
    default:
      sizeAcronym = 'xl';
  }

  return (
    <div
      style={{ borderColor: `${color}` }}
      className={`
        loading
        loading-${sizeAcronym}
        b--${color}
        Loader
      `}
    />
  );
};

Loader.defaultProps = {
  size: 'big',
  color: 'white',
};

Loader.propTypes = {
  size: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Loader;
