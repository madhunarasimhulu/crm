import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { childrenPropType } from '../../../constants';

class Hint extends Component {
  render() {
    const { isOpen, children } = this.props;

    const containerClasses = `
      absolute pa3 mv0 mv1-ns mh2 br1
      bg-pismo-lighter-gray pismo-darker
      shadow-pismo-1
      f7 f5-ns
      ${isOpen ? 'o-100' : 'o-0 mt3'}
      animate-all
      noclick
      z-1
    `;

    const arrowHeadClasses = 'bg-pismo-lighter-gray';
    const arrowHeadStyle = {
      width: '1em',
      height: '1em',
      top: '0.3em',
      left: '0.7em',
      transform: 'rotate(45deg)',
      transformOrigin: 'top right',
      position: 'absolute',
    };

    return (
      <div className={containerClasses}>
        <div className={arrowHeadClasses} style={arrowHeadStyle} />
        {children}
      </div>
    );
  }
}

Hint.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: childrenPropType,
};

Hint.defaultProps = {
  isOpen: false,
};

export default Hint;
