import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAvatar from 'react-user-avatar';
import { possibleAvatarColors } from '../../constants';

class CustomerAvatar extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    src: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bigLabel: PropTypes.bool,
    smallLabel: PropTypes.bool,
  };

  static defaultProps = {
    size: 24,
    bigLabel: false,
    smallLabel: false,
  };

  render() {
    const { name, src, size, bigLabel, smallLabel } = this.props;

    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const firstAndLastNames = `${firstName} ${lastName}`.toUpperCase();

    const avatarImgClasses = 'dib v-mid br-100';
    const avatarImgStyle = {
      width: size,
      height: size,
      backgroundImage: `url('${src}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 50%',
    };

    return (
      <span
        className={bigLabel ? 'BigAvatar' : smallLabel ? 'SmallAvatar' : ''}
      >
        {src ? (
          <div className={avatarImgClasses} style={avatarImgStyle} />
        ) : (
          <UserAvatar
            size={size}
            name={firstAndLastNames}
            colors={possibleAvatarColors}
          />
        )}
      </span>
    );
  }
}

export default CustomerAvatar;
