import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MdCheckCircle } from 'react-icons/md';
import { MdError } from 'react-icons/md';
import { MdWarning } from 'react-icons/md';
import { dismissToast } from '../../../actions';

import './Toast.scss';

const TOAST_DURATION = 5000;

class Toast extends Component {
  static propTypes = {
    message: PropTypes.string,
    style: PropTypes.string,
    isVisible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isVisible: false,
    style: 'success',
  };

  constructor(props) {
    super(props);
    this._timeout = null;
  }

  dismissToast = () => {
    const { message, isVisible, dispatch } = this.props;

    if (!isVisible || !message || !message.length) {
      return false;
    }

    this.clearTimeout();
    return dispatch(dismissToast());
  };

  clearTimeout() {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  handleClick = () => this.dismissToast();

  componentDidUpdate(prevProps) {
    const { isVisible: wasVisible, message: previousMessage } = prevProps;
    const { isVisible, message } = this.props;

    if (
      (!wasVisible && isVisible) ||
      (wasVisible && isVisible && previousMessage !== message)
    ) {
      this._timeout = window.setTimeout(this.dismissToast, TOAST_DURATION);
    }
  }

  render() {
    const { ui, isVisible, message, style } = this.props;
    const { isMobile, isMobileKeyboardVisible } = ui;

    const defaultBubbleClasses = `
      z-max
      fixed
      br-pill
      shadow-pismo-1
      pointer
      animate-all
      Toast
    `;

    const bubbleClasses = classnames(defaultBubbleClasses, {
      'bottom--6 o-0 noclick': !isVisible,
      'bottom-1-safe o-100': isVisible,
      'bottom-6 o-100': isVisible && isMobile && isMobileKeyboardVisible,
      'bg-pismo-dark-blue': !style || !style.length || style === 'success',
      'bg-pismo-orange': style === 'warning',
      'bg-pismo-pink': style === 'error',
    });

    const iconClasses = 'f3 f2-ns white Icon';
    const messageClasses = 'f7 f6-ns white fw4 Message';

    let icon;

    switch (style) {
      case 'error':
        icon = <MdError />;
        break;
      case 'warning':
        icon = <MdWarning />;
        break;
      case 'success':
      default:
        icon = <MdCheckCircle />;
    }

    return (
      <div className={bubbleClasses} onClick={this.handleClick}>
        <div className={iconClasses}>{icon}</div>
        <div className={messageClasses}>{message}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ ui, toast }) => ({
  ui,
  ...toast,
});

export default connect(mapStateToProps)(Toast);
