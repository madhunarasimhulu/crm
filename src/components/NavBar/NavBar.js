import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import './NavBar.scss';

export default class NavBar extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    leftSlot: PropTypes.node,
    rightSlot: PropTypes.node,
    theme: PropTypes.string,
    leftSlotClickHandler: PropTypes.func,
    rightSlotClickHandler: PropTypes.func,
  };

  handleLeftSlotClick = () => {
    const { leftSlotClickHandler } = this.props;

    if (!leftSlotClickHandler) {
      return false;
    }

    return leftSlotClickHandler();
  };

  handleRightSlotClick = () => {
    const { rightSlotClickHandler } = this.props;

    if (!rightSlotClickHandler) {
      return false;
    }

    return rightSlotClickHandler();
  };

  render() {
    const {
      theme,
      leftSlot,
      title,
      subtitle,
      rightSlot,
      leftSlotClickHandler,
      rightSlotClickHandler,
    } = this.props;

    const leftClass = `NavBar__LeftSlot ${
      leftSlot && leftSlotClickHandler ? 'pointer' : ''
    }`;
    const rightClass = `NavBar__RightSlot ${
      rightSlot && rightSlotClickHandler ? 'pointer' : ''
    }`;

    return (
      <div className={`NavBar NavBar--theme-${theme || 'none'}`}>
        <div className="NavBar__Wrapper">
          <div className={leftClass} onClick={this.handleLeftSlotClick}>
            {leftSlot !== undefined ? leftSlot : null}
          </div>
          <div className="NavBar__Center">
            {title && <div className="NavBar__Title">{title}</div>}
            {subtitle && <div className="NavBar__subtitle">{subtitle}</div>}
          </div>
          <div className={rightClass} onClick={this.handleRightSlotClick}>
            {rightSlot !== undefined ? rightSlot : <MdClose />}
          </div>
        </div>
      </div>
    );
  }
}
