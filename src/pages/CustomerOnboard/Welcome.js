import React from 'react';
import Banner from '../../assets/img/banner.png';

export const Welcome = ({ onBoardingConfig }) => {
  return (
    <section className="onboard-content">
      <div className="onboard-page-title">
        <p>{`Welcome to`}</p>
        <p>{onBoardingConfig?.name}</p>
      </div>
      <div className="welcome-message">
        <p>{`'Your Card Management Interface will be available soon, `}</p>
        <p>{`please check back after sometime...`}</p>
      </div>
      <div className="onboard-page-img-container">
        <img
          src={onBoardingConfig?.logo?.default}
          alt="banner-img"
          className="onboard-banner-img"
        />
      </div>
    </section>
  );
};
