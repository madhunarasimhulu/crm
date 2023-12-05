import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from 'react-user-avatar';
import { Loader } from '../../commons';
import { possibleAvatarColors } from '../../../constants';

const CustomerAvatar = ({ name: fullName, src, onClick }) => {
  const nameParts = fullName?.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const firstAndLastNames = `${firstName} ${lastName}`;

  const size = 60;
  const containerClasses = 'w-third dib v-mid BigAvatar';
  const placeholderClasses = 'dt br-100 bg-pismo-light-gray';
  const placeholderStyle = { width: `${size}px`, height: `${size}px` };
  const placeholderLoaderClasses = 'dtc v-mid';
  const placeholderLoaderStyle = {};

  const avatarClasses = `${
    onClick && typeof onClick === 'function' ? 'pointer' : ''
  }`;
  const avatarImgClasses = 'br-100';
  const avatarImgStyle = {
    width: size,
    height: size,
    backgroundImage: `url('${src}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 50%',
  };

  const avatar =
    fullName && fullName.length >= 0 ? (
      src ? (
        <div className={avatarImgClasses} style={avatarImgStyle} />
      ) : (
        <UserAvatar
          size={size}
          name={firstAndLastNames}
          colors={possibleAvatarColors}
        />
      )
    ) : (
      <div className={placeholderClasses} style={placeholderStyle}>
        <div
          className={placeholderLoaderClasses}
          style={placeholderLoaderStyle}
        >
          <Loader />
        </div>
      </div>
    );

  const handleClick = () => onClick && onClick();

  return (
    <div className={containerClasses}>
      <div className={avatarClasses} onClick={handleClick}>
        {avatar}
      </div>
    </div>
  );
};

CustomerAvatar.defaultProps = {
  name: '',
  isLoading: false,
  src: null,
};

CustomerAvatar.propTypes = {
  name: PropTypes.string,
  isLoading: PropTypes.bool,
  src: PropTypes.string,
};

export default CustomerAvatar;
