import React from 'react';
import PropTypes from 'prop-types';

const CreditProgress = ({ total, available }) => {
  const totalSpent = total - available;
  const totalAvailablePercentage = 100 - (totalSpent / total) * 100;

  const trackClasses = 'relative db w-100 bg-pismo-darker';
  const strokeClasses = 'bg-pismo-bright-blue animate-all-slow';

  const sizeStyle = { height: '5px' };
  const trackStyle = { ...sizeStyle };
  const strokeStyle = {
    ...sizeStyle,
    maxWidth: `${totalAvailablePercentage}%`,
  };

  return (
    <div className={trackClasses} style={trackStyle}>
      <div className={strokeClasses} style={strokeStyle} />
    </div>
  );
};

CreditProgress.defaultProps = {
  total: 1,
  available: 1,
};

CreditProgress.propTypes = {
  total: PropTypes.number,
  available: PropTypes.number,
};

export default CreditProgress;
