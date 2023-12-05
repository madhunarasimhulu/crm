import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const containerClasses = `
  w-100 bottom-0 mw6dot5-ns center-ns tc
`;
const btnClasses = `
  db w-100 pv3
  bg-white pismo-darker-blue hover-bg-pismo-dark-blue hover-white
  pointer no-underline f6
`;

const commonlabelClasses = 'dib ml1 fw4 pb1';
const activeLabelClasses = 'bb b--pismo-darker-blue';

// This component is derived from StickyBottomAction

const ActionButton = ({ onClick, to, isLoading, children, className }) => {
  const Clickable = to && to.length > 0 ? Link : 'a';

  const labelClasses = `
    ${commonlabelClasses}
    ${isLoading ? '' : activeLabelClasses}
  `;

  return (
    <div className={`${containerClasses} ${className}`}>
      <Clickable className={btnClasses} to={to} onClick={onClick}>
        <span className={labelClasses}>{children}</span>
      </Clickable>
    </div>
  );
};

ActionButton.propTypes = {
  onClick: PropTypes.func,
  to: PropTypes.string,
  isLoading: PropTypes.bool,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};

ActionButton.defaultProps = {
  onClick: Function.prototype,
  isLoading: false,
  className: '',
};

export default ActionButton;
