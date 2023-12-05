import React from 'react';
import './Label.scss';

const Label = ({ error, className, children, ...props }) => (
  <label className={`${className} Label`} {...props}>
    {children}
  </label>
);

export default Label;
