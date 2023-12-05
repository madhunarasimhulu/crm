import React from 'react';
import { useSelector } from 'react-redux';
import './BrandStyles.scss';
const BrandProvider = (props) => {
  const { clientId = sessionStorage.getItem('clientId') } = useSelector(
    (state) => state.onBoard,
  );
  return <div className={clientId}>{props.children}</div>;
};

export default BrandProvider;
