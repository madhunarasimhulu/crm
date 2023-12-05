import React from 'react';
import { childrenPropType } from '../../constants';

const PageWrapper = ({ children }, props) => (
  <div>
    <div>{children}</div>
  </div>
);

PageWrapper.propTypes = {
  children: childrenPropType,
};

export default PageWrapper;
