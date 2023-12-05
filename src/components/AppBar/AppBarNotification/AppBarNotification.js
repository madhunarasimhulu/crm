import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdNotifications } from 'react-icons/md';
import './AppBarNotification.scss';

class AppBarNotification extends Component {
  render() {
    const { hasNotifications } = this.props;

    if (hasNotifications) {
      return (
        <div className="notifications-bubble">
          <MdNotifications
            className="notifications-btn"
            alt="You have unread notifications"
          />
        </div>
      );
    }
    return (
      <MdNotifications
        className="notifications-btn"
        alt="You don't have new notifications"
      />
    );
  }
}

AppBarNotification.propTypes = {
  hasNotifications: PropTypes.bool,
};

AppBarNotification.defaultProps = {
  hasNotifications: false,
};

export default AppBarNotification;
